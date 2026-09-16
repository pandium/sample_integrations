require 'date'
require_relative 'lib'
require_relative 'gorgias'
require_relative 'shipbob'

module Sb2Gorgias
  # The cron flow: ShipBob orders -> Gorgias customer sidebar.
  #
  # Keeps each Gorgias customer's data.pandium.shipbob_orders in sync with that customer's
  # recent ShipBob orders. Runs on a schedule and resumes where the last run left off, using
  # tenant metadata as the cursor.
  #
  # The run is bounded at ~10 minutes by Pandium. To stay resumable, a background watchdog
  # thread flushes the cursor and exits cleanly at 9 minutes if the run is still going -
  # exiting 0 on timeout means the partial cursor is merged into metadata and the next run
  # picks up from there.
  #
  # The two cursors resume differently. new_order_start_date climbs per order over an
  # oldest-first query, so it is sound wherever the run stops. updated_order_start_date is the
  # minimum across every page, so it only holds once the query is exhausted - an unread page
  # can carry an older update - and a run cut short leaves it where it started. Re-syncing what
  # it covers again is harmless: customer writes are idempotent PUTs.
  module Cron
    LOGGER = Sb2Gorgias.new_logger('cron')

    ALARM_SECONDS = 540 # self-imposed 9-min deadline
    ONE_MONTH_SECONDS = 30 * 24 * 60 * 60
    MAX_ORDERS_TO_SYNC = 10 # most recent N orders kept on each customer

    # Parses an ISO 8601 string into a naive-equivalent UTC Time, dropping any offset the
    # source carried rather than shifting the instant by it. Unparseable/missing values
    # return nil. A fraction longer than microseconds is truncated, not rounded - ShipBob
    # sends 7-digit fractions, and truncating keeps this consistent with the plain string
    # slicing used elsewhere to trim those same timestamps.
    def self.parse_naive(str)
      d = DateTime.iso8601(str.to_s)
      Time.utc(d.year, d.month, d.day, d.hour, d.minute, d.second, (d.sec_fraction * 1_000_000).truncate)
    rescue ArgumentError, TypeError
      nil
    end

    # Keeps a cursor within [now - 1 month, now]. Unparseable/missing values fall back to one
    # month ago (the oldest window we ever fetch).
    def self.clamp(value, now)
      floor = now - ONE_MONTH_SECONDS
      parsed = value && !value.to_s.empty? ? parse_naive(value) : nil
      return floor if parsed.nil?

      [[parsed, floor].max, now].min
    end

    # Merges order_payload into a customer's order list (replace by id, else append), then
    # sorts and trims to the most recent MAX_ORDERS_TO_SYNC. The replace-by-id path skips
    # sort/trim entirely - only the append path re-sorts.
    def self.upsert(orders, order_payload, newest_first)
      idx = orders.find_index { |o| o['id'] == order_payload['id'] }
      if idx
        orders[idx] = order_payload
        return orders
      end

      orders << order_payload
      orders.sort_by! { |o| o['id'].is_a?(Integer) ? o['id'] : 0 }
      orders.reverse! if newest_first
      newest_first ? orders.first(MAX_ORDERS_TO_SYNC) : orders.last(MAX_ORDERS_TO_SYNC)
    end

    # Finds-or-creates the order's Gorgias customer, then PUT/POSTs its updated
    # data.pandium.shipbob_orders. cache accumulates customer payloads within a run so
    # multiple orders for one customer batch onto the same record.
    def self.process_order(sb_order, gorgias, cache, newest_first)
      key = gorgias.customer_key(sb_order)
      email = gorgias.valid_email(Sb2Gorgias.deep_get(sb_order, 'recipient.email', ''))

      unless cache.key?(key)
        existing = begin
          gorgias.find_customer(email: email.empty? ? nil : email, external_id: email.empty? ? key : nil)
        rescue StandardError => e
          LOGGER.error("skipping order #{sb_order['id']} -- cannot fetch customer #{key}: #{e}")
          return
        end

        if existing
          # Anything already under data.pandium came from outside this integration - a
          # hand-edited customer can carry {"pandium": null} - so check the type at every
          # level rather than just the leaf.
          data = existing['data'].is_a?(Hash) ? existing['data'] : {}
          pandium = data['pandium'].is_a?(Hash) ? data['pandium'] : {}
          pandium['shipbob_orders'] = [] unless pandium['shipbob_orders'].is_a?(Array)
          data['pandium'] = pandium
          cache[key] = { 'id' => existing['id'], 'data' => data }
        else
          cache[key] = gorgias.new_customer_payload(sb_order, key)
        end
      end

      customer = cache[key]
      customer['data']['pandium']['shipbob_orders'] =
        upsert(customer['data']['pandium']['shipbob_orders'], gorgias.order_data_payload(sb_order), newest_first)

      begin
        if customer.key?('id')
          gorgias.update_customer(customer['id'], customer)
        else
          customer['id'] = gorgias.create_customer(customer)
        end
      rescue StandardError => e
        LOGGER.error("failed to upsert Gorgias customer #{key}: #{e}")
      end
    end

    # Schedules on_timeout to run after `seconds`, returning a callable that cancels it.
    # Runs on a real background thread so a hung network call elsewhere doesn't block the
    # deadline from firing - Process.exit from that thread tears down the whole process
    # regardless of what the main thread is doing at the time.
    def self.default_arm_watchdog(seconds, &on_timeout)
      thread = Thread.new do
        sleep(seconds)
        on_timeout.call
      end
      mutex = Mutex.new
      cancelled = false
      lambda do
        mutex.synchronize do
          next if cancelled

          cancelled = true
          thread.kill
        end
      end
    end

    # deps is the injection point tests use: now:, shipbob:, gorgias:, arm_watchdog:, exit_fn:.
    def self.run(pandium, deps = {})
      now = deps[:now] || Time.now.utc
      exit_fn = deps[:exit_fn] || ->(code) { Process.exit(code) }
      shipbob = deps[:shipbob] || ShipBobAPI.new(pandium)
      gorgias = deps[:gorgias] || GorgiasAPI.new(pandium)
      newest_first = pandium.config['newest_order_first'].to_s.downcase == 'true'

      metadata = pandium.metadata || {}
      fallback = pandium.config['order_start_date']
      new_cursor = clamp(metadata['new_order_start_date'] || fallback, now)
      updated_cursor = clamp(metadata['updated_order_start_date'] || fallback, now)

      record = {
        'new_order_start_date' => Sb2Gorgias.isoformat(new_cursor),
        'updated_order_start_date' => Sb2Gorgias.isoformat(updated_cursor),
      }

      cancel_watchdog = (deps[:arm_watchdog] || method(:default_arm_watchdog)).call(ALARM_SECONDS) do
        LOGGER.warn('approaching the run-time limit; flushing cursor for the next run')
        # Same writer the normal path uses, so there is exactly one route to stdout.
        pandium.update_metadata(record)
        exit_fn.call(0) # timed-out run still counts as successful -> partial cursor merged
      end

      cache = {}

      # New orders: SortOrder=Oldest, so created_date advances forward monotonically.
      LOGGER.info("syncing new ShipBob orders; start_date=#{record['new_order_start_date']}")
      page = 1
      loop do
        orders = shipbob.get_new_orders_page(new_cursor, page)
        break if orders.empty?

        orders.each do |order|
          LOGGER.info("processing new order; order_id=#{order['id']}")
          process_order(order, gorgias, cache, newest_first)
          created = order['created_date']
          record['new_order_start_date'] = created.to_s[0, 26] if created && !created.to_s.empty?
        end
        page += 1
      end

      # Updated orders: keyed off shipment last_update_at (see ShipBobAPI#get_updated_orders_page).
      LOGGER.info("syncing updated ShipBob orders; start_date=#{record['updated_order_start_date']}")
      page = 1
      # Each page is sorted newest-first, but pages are not sorted relative to each other, so
      # the cursor is the minimum across every processed order - not whatever the last order of
      # the last page happened to carry. Kept in a local variable until the loop ends: every
      # update date is, by construction, later than the starting cursor, so folding that in
      # would pin the cursor there forever, and a partial minimum would sit newer than the
      # pages still unread.
      oldest_update = nil
      loop do
        orders = shipbob.get_updated_orders_page(updated_cursor, page)
        break if orders.empty?

        orders.each do |order|
          LOGGER.info("processing updated order; order_id=#{order['id']}")
          process_order(order, gorgias, cache, newest_first)
          update_date = ShipBobAPI.get_update_date(order, updated_cursor, now)[0, 23]
          oldest_update = update_date if oldest_update.nil? || update_date < oldest_update
        end
        page += 1
      end
      # Every page is in, so the minimum is final and safe to resume from.
      record['updated_order_start_date'] = oldest_update unless oldest_update.nil?

      cancel_watchdog.call # made it - no timeout to flush
      record
    end
  end
end
