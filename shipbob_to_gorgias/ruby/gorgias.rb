require 'json'
require 'uri'
require 'date'
require 'faraday'
require 'faraday/retry'

require_relative 'lib'

module Sb2Gorgias
  # Only a recipient email Gorgias would actually accept counts as valid.
  EMAIL_RE = %r{\A(?:([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([\]!#-\[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*\]))\z}

  # ShipBob sends 7-digit fractional seconds; ISO 8601 parsing takes at most 6.
  ISO_LONG_FRACTION_RE = /(\.\d{6})\d+/
  OFFSET_SUFFIX_RE = /(Z|[+-]\d{2}:?\d{2})\z/

  # A human-readable timezone name (UTC, or UTC+HH:MM) derived from the ORIGINAL string's
  # trailing offset - not from a parsed DateTime, which always carries an offset (defaulting
  # to +00:00 when the source had none), so "did this value have an offset at all?" can only
  # be answered from the source text.
  def self.tzname_suffix(iso_str)
    m = OFFSET_SUFFIX_RE.match(iso_str)
    return '' unless m
    return 'UTC' if m[1] == 'Z'

    sign = m[1][0]
    digits = m[1][1..].delete(':')
    hh, mm = digits[0, 2].to_i, digits[2, 2].to_i
    return 'UTC' if hh.zero? && mm.zero?

    format('UTC%s%02d:%02d', sign, hh, mm)
  end

  # Formats a ShipBob timestamp for the customer sidebar. An unparseable value passes through
  # unchanged rather than becoming an error or an empty string.
  def self.format_date(value)
    return '' if value.nil? || value == ''

    trimmed = value.to_s.gsub(ISO_LONG_FRACTION_RE, '\1')
    begin
      parsed = DateTime.iso8601(trimmed)
    rescue ArgumentError, TypeError
      return value
    end

    tzname = tzname_suffix(trimmed)
    out = parsed.strftime('%d/%m/%Y %H:%M:%S')
    tzname.empty? ? out : "#{out} #{tzname}"
  end

  # Gorgias API client - customer sidebar sync and shipment ticket creation.
  #
  # Auth is OAuth2 bearer via gorgias_oauth_access_token/_account/_token_type (default Bearer).
  class GorgiasAPI
    LOGGER = Sb2Gorgias.new_logger('gorgias')

    def initialize(pandium)
      secrets = pandium.secrets
      token = secrets['gorgias_oauth_access_token']
      account = secrets['gorgias_oauth_account']
      if token.nil? || token.empty? || account.nil? || account.empty?
        raise 'PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN and PAN_SEC_GORGIAS_OAUTH_ACCOUNT are required'
      end

      @api_url = "https://#{account.downcase}.gorgias.com/api"
      token_type = secrets['gorgias_oauth_token_type']
      token_type = 'Bearer' if token_type.nil? || token_type.empty?

      @conn = Faraday.new(url: @api_url) do |f|
        # POST isn't retried on a bare timeout - Gorgias may have already processed it, and
        # retrying could create a duplicate. It still retries on a retryable status code.
        f.request :retry, max: 6, interval: 2, backoff_factor: 2,
                           retry_statuses: [429, 502, 503, 504], methods: %i[get put],
                           retry_if: ->(_env, exception) { exception.is_a?(Faraday::RetriableResponse) }
        f.headers['Authorization'] = "#{token_type} #{token}"
        f.headers['Accept'] = 'application/json'
        f.headers['Content-Type'] = 'application/json'
        f.options.open_timeout = 10
        f.options.timeout = 30
        f.adapter Faraday.default_adapter
      end
    end

    # Prefers email over external_id when both are given. find_customer has NO rescue here -
    # raises raw, unlike create_customer/update_customer/create_ticket below, which all log
    # and reraise. This asymmetry is deliberate.
    def find_customer(email: nil, external_id: nil)
      return nil if (email.nil? || email.empty?) && (external_id.nil? || external_id.empty?)

      LOGGER.info("looking for Gorgias customer: #{email}, #{external_id}")
      # Only email is lowercased - external_id is an exact match, and lowercasing it here
      # wouldn't match the mixed case new_customer_payload actually stored.
      query = email && !email.empty? ? "email=#{URI.encode_www_form_component(email.downcase)}"
                                      : "external_id=#{URI.encode_www_form_component(external_id)}"
      res = @conn.get("customers?#{query}")
      raise "Gorgias customer lookup failed: #{res.status}" unless res.success?

      rows = JSON.parse(res.body)['data'] || []
      if rows.empty?
        LOGGER.info('customer not found')
        return nil
      end

      detail = @conn.get("customers/#{rows[0]['id']}")
      raise "Gorgias customer detail fetch failed: #{detail.status}" unless detail.success?

      LOGGER.info('customer found')
      JSON.parse(detail.body)
    end

    def create_customer(payload)
      LOGGER.info('creating new Gorgias customer')
      res = @conn.post('customers') { |r| r.body = JSON.generate(payload) }
      raise "Gorgias create customer failed: #{res.status} #{res.body}" unless res.success?

      LOGGER.info('customer created successfully')
      JSON.parse(res.body)['id']
    rescue Faraday::Error => e
      LOGGER.error("create customer failed: #{e}")
      raise
    end

    def update_customer(customer_id, payload)
      LOGGER.info("updating Gorgias customer #{customer_id}")
      res = @conn.put("customers/#{customer_id}") { |r| r.body = JSON.generate(payload) }
      raise "Gorgias update customer failed: #{res.status} #{res.body}" unless res.success?

      LOGGER.info('customer updated')
      nil
    rescue Faraday::Error => e
      LOGGER.error("update customer #{customer_id} failed: #{e}")
      raise
    end

    def create_ticket(payload)
      LOGGER.info('creating Gorgias ticket')
      res = @conn.post('tickets') { |r| r.body = JSON.generate(payload) }
      raise "Gorgias create ticket failed: #{res.status} #{res.body}" unless res.success?

      JSON.parse(res.body)
    rescue Faraday::Error => e
      LOGGER.error("create ticket failed: #{e}")
      raise
    end

    def valid_email(email)
      email && !email.empty? && !email.include?('.@') && EMAIL_RE.match?(email) ? email : ''
    end

    # Email when there is one, otherwise a synthetic "name address1 city country" key.
    def customer_key(sb_order)
      email = valid_email(Sb2Gorgias.deep_get(sb_order, 'recipient.email', ''))
      return email unless email.empty?

      address = Sb2Gorgias.deep_get(sb_order, 'recipient.address', {})
      [
        Sb2Gorgias.loose_or(Sb2Gorgias.deep_get(sb_order, 'recipient.name', ''), ''),
        Sb2Gorgias.loose_or(Sb2Gorgias.deep_get(address, 'address1', ''), ''),
        Sb2Gorgias.loose_or(Sb2Gorgias.deep_get(address, 'city', ''), ''),
        Sb2Gorgias.loose_or(Sb2Gorgias.deep_get(address, 'country', ''), ''),
      ].join(' ')
    end

    def new_customer_payload(sb_order, key)
      payload = {
        'name' => Sb2Gorgias.deep_get(sb_order, 'recipient.name', ''),
        'external_id' => key,
        'data' => { 'pandium' => { 'shipbob_orders' => [] } },
      }
      email = valid_email(Sb2Gorgias.deep_get(sb_order, 'recipient.email', ''))
      payload['email'] = email unless email.empty? # key entirely absent otherwise, not ''
      payload
    end

    def order_data_payload(sb_order)
      shipments = Sb2Gorgias.deep_get(sb_order, 'shipments', []) || []
      shipments.each do |shipment|
        %w[estimated_fulfillment_date actual_fulfillment_date].each do |field|
          shipment[field] = Sb2Gorgias.format_date(shipment[field]) if shipment[field]
        end
        shipment['url'] = "https://web.shipbob.com/App/Merchant/#/Orders/#{shipment['id']}/"
      end
      {
        'id' => Sb2Gorgias.deep_get(sb_order, 'id', ''),
        'created_date' => Sb2Gorgias.format_date(Sb2Gorgias.deep_get(sb_order, 'created_date', '')),
        'purchase_date' => Sb2Gorgias.format_date(Sb2Gorgias.deep_get(sb_order, 'purchase_date', '')),
        'reference_id' => Sb2Gorgias.deep_get(sb_order, 'reference_id', ''),
        'order_number' => Sb2Gorgias.deep_get(sb_order, 'order_number', ''),
        'status' => Sb2Gorgias.deep_get(sb_order, 'status', ''),
        'type' => Sb2Gorgias.deep_get(sb_order, 'type', ''),
        'channel' => Sb2Gorgias.deep_get(sb_order, 'channel', {}),
        'shipping_method' => Sb2Gorgias.deep_get(sb_order, 'shipping_method', ''),
        'recipient' => Sb2Gorgias.deep_get(sb_order, 'recipient', {}),
        'products' => Sb2Gorgias.deep_get(sb_order, 'products', []),
        'tags' => Sb2Gorgias.deep_get(sb_order, 'tags', []),
        'shipments' => shipments,
      }
    end
  end
end
