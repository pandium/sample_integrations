require 'json'
require 'time'
require_relative 'lib'
require_relative 'gorgias'

module Sb2Gorgias
  # The webhook flow: ShipBob shipment status changes -> Gorgias tickets.
  #
  # Each run reads its webhook deliveries from the environment (Pandium debounces multiple
  # deliveries into one run), dedupes against tenant metadata so a re-delivered event doesn't
  # open a second ticket, and prunes entries older than PRUNE_WINDOW so metadata doesn't grow
  # without bound.
  module Webhook
    LOGGER = Sb2Gorgias.new_logger('webhook')

    PRUNE_WINDOW_SECONDS = 30 * 60
    SHIPMENT_TAG = 'shipbob-shipment'

    # Drops entries older than PRUNE_WINDOW, or with an unparseable timestamp (treated as
    # already expired). Returns a new hash rather than mutating the input.
    #
    # Uses Time.iso8601, not the much looser Time.parse, which happily invents a plausible
    # time out of nearly any string instead of raising on genuine garbage.
    def self.prune(processed, now)
      processed.each_with_object({}) do |(event_key, ts), kept|
        str = ts.to_s
        str += '+00:00' unless str =~ /(Z|[+-]\d{2}:?\d{2})\z/ # assume UTC when the timestamp has no offset
        when_ = begin
          Time.iso8601(str)
        rescue ArgumentError, TypeError
          nil
        end
        next if when_.nil?

        kept[event_key] = ts if (now - when_) <= PRUNE_WINDOW_SECONDS
      end
    end

    # id when present, else shipment_id - falls through on a literal 0 too, not just nil/''.
    def self.shipment_id(event)
      Sb2Gorgias.loose_or(Sb2Gorgias.deep_get(event, 'id', ''), Sb2Gorgias.deep_get(event, 'shipment_id', '')).to_s
    end

    def self.status_details(event)
      details = Sb2Gorgias.deep_get(event, 'status_details', []) || []
      details.select { |d| d }.map { |d| d['description'] || d['name'] || '' }.join('; ')
    end

    def self.items(event)
      lines = (Sb2Gorgias.deep_get(event, 'products', []) || []).map do |product|
        quantity = (product['inventory_items'] || []).sum { |i| i['quantity'] || 0 }
        sku = product['sku'] || product['reference_id'] || ''
        line = "#{quantity} x #{product['name'] || ''}"
        sku.empty? ? line : "#{line} (#{sku})"
      end
      lines.join("\n")
    end

    # Assembles a Gorgias ticket payload from a shipment status-change event. body_text and
    # body_html are built from deliberately DIFFERENT conditional sets - see the inline notes -
    # this asymmetry is intentional, not an inconsistency to clean up.
    def self.build_ticket(event, customer_ref)
      sid = shipment_id(event)
      order_id = Sb2Gorgias.deep_get(event, 'order_id', '')
      reference_id = Sb2Gorgias.loose_or(Sb2Gorgias.deep_get(event, 'reference_id', ''), order_id)
      status = Sb2Gorgias.deep_get(event, 'status', 'Updated')
      reasons = status_details(event)
      carrier = Sb2Gorgias.deep_get(event, 'tracking.carrier', '')
      tracking_number = Sb2Gorgias.deep_get(event, 'tracking.tracking_number', '')
      delivered_on = (Sb2Gorgias.deep_get(event, 'delivery_date', '') || '')[0, 10]
      item_lines = items(event)

      headline = "Shipment #{sid} for order #{reference_id} is now #{status}."

      text_lines = [headline]
      text_lines << "Reason: #{reasons}" unless reasons.empty?
      text_lines << "Tracking: #{carrier} #{tracking_number}".strip if !carrier.to_s.empty? || !tracking_number.to_s.empty?
      text_lines << "Delivered on: #{delivered_on}" unless delivered_on.to_s.empty?
      text_lines << "Items:\n#{item_lines}" unless item_lines.empty?
      body_text = text_lines.join("\n")

      html = ["<p>#{headline}</p>"]
      html << "<p><b>Reason:</b> #{reasons}</p>" unless reasons.empty?
      # No .strip() here, unlike body_text above - deliberate.
      html << "<p><b>Tracking:</b> #{carrier} #{tracking_number}</p>" if !carrier.to_s.empty? || !tracking_number.to_s.empty?
      # No "Delivered on" block in HTML at all - only in body_text.
      html << "<ul>#{item_lines.split("\n").map { |line| "<li>#{line}</li>" }.join}</ul>" unless item_lines.empty?

      message = {
        'sender' => customer_ref, 'channel' => 'api', 'via' => 'api', 'from_agent' => false,
        'subject' => "Order #{reference_id}: shipment #{status}",
        'body_text' => body_text, 'body_html' => html.join, 'stripped_text' => headline,
      }

      {
        'customer' => customer_ref, 'channel' => 'api', 'via' => 'api', 'from_agent' => false,
        'status' => 'open', 'messages' => [message],
        'tags' => [{ 'name' => SHIPMENT_TAG }, { 'name' => "shipbob-#{status.to_s.downcase.gsub(' ', '-')}" }],
      }
    end

    # Same customer-key logic as the cron flow, reused against a shipment event's shape.
    def self.resolve_customer(gorgias, event)
      email = gorgias.valid_email(Sb2Gorgias.deep_get(event, 'recipient.email', ''))
      key = gorgias.customer_key(event)
      existing = gorgias.find_customer(email: email.empty? ? nil : email, external_id: email.empty? ? key : nil)
      return { 'id' => existing['id'] } if existing

      { 'id' => gorgias.create_customer(gorgias.new_customer_payload(event, key)) }
    end

    def self.run(pandium, deps = {})
      now = deps[:now] || Time.now.utc
      metadata = pandium.metadata || {}
      processed = prune(metadata['processed_events'] || {}, now)
      gorgias = deps[:gorgias] || GorgiasAPI.new(pandium)
      now_iso = now.strftime('%Y-%m-%dT%H:%M:%S.%6N+00:00')
      created = 0

      pandium.webhook_deliveries.each do |delivery|
        event = begin
          JSON.parse(delivery.body)
        rescue JSON::ParserError => e
          LOGGER.error("webhook delivery #{delivery.id} is not valid JSON: #{e}")
          next
        end

        sid = shipment_id(event)
        if sid.empty?
          LOGGER.warn("webhook delivery #{delivery.id} has no shipment id; skipping")
          next
        end

        status = Sb2Gorgias.deep_get(event, 'status', 'Updated')
        event_key = "#{sid}:#{status}"
        if processed.key?(event_key)
          LOGGER.info("shipment #{sid} already ticketed as #{status}; skipping duplicate")
          next
        end

        customer_ref = begin
          resolve_customer(gorgias, event)
        rescue StandardError => e
          LOGGER.error("could not resolve Gorgias customer for shipment #{sid}: #{e}")
          next
        end

        ticket = begin
          gorgias.create_ticket(build_ticket(event, customer_ref))
        rescue StandardError => e
          LOGGER.error("failed to open ticket for shipment #{sid}: #{e}")
          next
        end

        processed[event_key] = now_iso
        created += 1
        LOGGER.info("opened Gorgias ticket #{ticket['id']} for shipment #{sid} (#{status})")
      end

      LOGGER.info("webhook flow: opened #{created} ticket(s); tracking #{processed.size} event(s)")
      { 'processed_events' => processed }
    end
  end
end
