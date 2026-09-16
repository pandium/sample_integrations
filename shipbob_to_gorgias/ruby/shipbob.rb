require 'base64'
require 'json'
require 'faraday'
require 'faraday/retry'

require_relative 'lib'

module Sb2Gorgias
  # ShipBob API client - reads orders for the cron sync.
  #
  # Auth is a single bearer token (PAN_SEC_SHIPBOB_ACCESS_TOKEN). The base URL is resolved from
  # the token's issuer (iss) claim, so the same code targets prod, sandbox, or QA depending on
  # which token the tenant connected.
  class ShipBobAPI
    LOGGER = Sb2Gorgias.new_logger('shipbob')

    AUTH_URL_TO_BASE_URL = {
      'https://authstage.shipbob.com' => 'https://sandbox-api.shipbob.com/2026-01',
      'https://auth.shipbob.com' => 'https://api.shipbob.com/2026-01',
    }.freeze
    DEFAULT_BASE_URL = 'https://api.shipbob.com/2026-01'

    # Decodes the JWT payload and maps its iss claim to an API base URL.
    def self.resolve_base_url(token)
      payload = token.split('.')[1]
      payload += '=' * ((4 - payload.length % 4) % 4)
      claims = JSON.parse(Base64.urlsafe_decode64(payload))
      AUTH_URL_TO_BASE_URL.fetch(claims['iss'], DEFAULT_BASE_URL)
    rescue StandardError => e
      LOGGER.warn("could not resolve ShipBob base URL from token: #{e}")
      DEFAULT_BASE_URL
    end

    def initialize(pandium)
      token = pandium.secrets['shipbob_access_token']
      raise 'PAN_SEC_SHIPBOB_ACCESS_TOKEN is required' if token.nil? || token.empty?

      @api_url = self.class.resolve_base_url(token)
      @conn = Faraday.new(url: @api_url) do |f|
        f.request :retry, max: 6, interval: 3, backoff_factor: 2, retry_statuses: [429, 502, 503, 504]
        f.headers['Authorization'] = "Bearer #{token}"
        f.headers['Accept'] = 'application/json'
        f.options.open_timeout = 10
        f.options.timeout = 30
        f.adapter Faraday.default_adapter
      end
    end

    # GETs one page of /order. Only an exhausted query answers with an empty list. The caller
    # stops paging there and commits its cursor, so a failure - or a 200 carrying something
    # other than a list - raises instead.
    def get_orders(params)
      res = @conn.get('/order', params)
      raise "ShipBob order fetch failed: #{res.status}" unless res.success?

      data = res.body.to_s.empty? ? nil : JSON.parse(res.body)
      return [] if data.nil?
      raise "ShipBob answered /order (#{params}) with #{data.inspect}" unless data.is_a?(Array)

      data
    rescue Faraday::Error, JSON::ParserError => e
      LOGGER.error("ShipBob order fetch failed (#{params}): #{e}")
      raise
    end

    # One page of orders created since start_date, oldest first.
    def get_new_orders_page(start_date, page)
      get_orders('StartDate' => Sb2Gorgias.isoformat(start_date), 'Page' => page, 'SortOrder' => 'Oldest')
    end

    # One page of orders updated since start_date.
    #
    # ShipBob puts last_update_at on shipments, not orders, so we derive a per-order update
    # timestamp and sort the page newest-first. Advancing the cursor to the oldest processed
    # update keeps the sync conservative: a timed-out run never skips an update, at the cost of
    # some reprocessing (which is harmless - customer writes are idempotent PUTs).
    #
    # Each order's date is computed once (not once per comparison) by pairing it alongside the
    # order before sorting, then unwrapping - a plain Ruby array holds the pairs, no identity
    # map or memoization hack needed since get_update_date is now a pure function of its args.
    def get_updated_orders_page(start_date, page)
      orders = get_orders('LastUpdateStartDate' => Sb2Gorgias.isoformat(start_date), 'Page' => page)
      now = Time.now.utc
      dated = orders.map { |order| [self.class.get_update_date(order, start_date, now), order] }
      dated.sort_by! { |date, _| date }
      dated.reverse!
      dated.map { |_, order| order }
    end

    # The oldest shipment last_update_at on order that still falls after start_date; defaults
    # to now when none qualify. Compared as strings, not parsed timestamps. now is passed in,
    # not read from the clock, so repeated calls for the same order are stable.
    def self.get_update_date(order, start_date, now)
      start_str = Sb2Gorgias.isoformat(start_date)
      update_date = Sb2Gorgias.isoformat(now)
      (order['shipments'] || []).each do |shipment|
        ts = shipment && shipment['last_update_at']
        update_date = ts if ts && start_str < ts && ts < update_date
      end
      update_date
    end
  end
end
