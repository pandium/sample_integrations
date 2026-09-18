require_relative 'test_helper'
require_relative 'fakes'
require_relative '../shipbob'
require 'base64'
require 'json'
require 'time'
require 'faraday'

class ShipBobTest < Minitest::Test
  def jwt_with_iss(iss)
    header = Base64.urlsafe_encode64(JSON.generate({ 'alg' => 'none' }), padding: false)
    payload = Base64.urlsafe_encode64(JSON.generate({ 'iss' => iss }), padding: false)
    "#{header}.#{payload}."
  end

  def test_resolve_base_url_sandbox
    assert_equal 'https://sandbox-api.shipbob.com/2026-01',
                 Sb2Gorgias::ShipBobAPI.resolve_base_url(jwt_with_iss('https://authstage.shipbob.com'))
  end

  def test_resolve_base_url_prod
    assert_equal 'https://api.shipbob.com/2026-01',
                 Sb2Gorgias::ShipBobAPI.resolve_base_url(jwt_with_iss('https://auth.shipbob.com'))
  end

  def test_resolve_base_url_unknown_issuer_falls_back_to_default
    assert_equal Sb2Gorgias::ShipBobAPI::DEFAULT_BASE_URL,
                 Sb2Gorgias::ShipBobAPI.resolve_base_url(jwt_with_iss('https://unknown.example.com'))
  end

  def test_resolve_base_url_malformed_jwt_falls_back_to_default
    assert_equal Sb2Gorgias::ShipBobAPI::DEFAULT_BASE_URL, Sb2Gorgias::ShipBobAPI.resolve_base_url('not-a-jwt')
  end

  def test_get_update_date_picks_oldest_qualifying_shipment_timestamp
    start_date = Time.utc(2026, 7, 1)
    now = Time.utc(2026, 7, 20)
    order = {
      'shipments' => [
        { 'last_update_at' => '2026-07-10T00:00:00' },
        { 'last_update_at' => '2026-07-05T00:00:00' }, # oldest that still qualifies
        { 'last_update_at' => '2026-06-01T00:00:00' }, # before start_date -- excluded
      ],
    }
    assert_equal '2026-07-05T00:00:00', Sb2Gorgias::ShipBobAPI.get_update_date(order, start_date, now)
  end

  def test_get_update_date_defaults_to_now_when_nothing_qualifies
    start_date = Time.utc(2026, 7, 1)
    now = Time.utc(2026, 7, 20)
    assert_equal Sb2Gorgias.isoformat(now), Sb2Gorgias::ShipBobAPI.get_update_date({ 'shipments' => [] }, start_date, now)
  end

  # Regression test: an absolute path ('/order') resolved against a base URL that has its
  # own path segment (".../2026-01") replaces that segment instead of appending to it, per
  # RFC 3986 merge rules -- silently dropping the API version and 404ing. get_orders must
  # request a relative path so it appends.
  def test_get_new_orders_page_requests_the_versioned_order_path
    stubs = Faraday::Adapter::Test::Stubs.new
    requested_path = nil
    stubs.get('/2026-01/order') do |env|
      requested_path = env.url.path
      [200, {}, '[]']
    end

    api = Sb2Gorgias::ShipBobAPI.new(
      make_pandium(secrets: { 'shipbob_access_token' => jwt_with_iss('https://auth.shipbob.com') })
    )
    api.instance_variable_set(:@conn, Faraday.new(url: Sb2Gorgias::ShipBobAPI::DEFAULT_BASE_URL) { |f| f.adapter :test, stubs })

    api.get_new_orders_page(Time.utc(2026, 1, 1), 1)

    assert_equal '/2026-01/order', requested_path
    stubs.verify_stubbed_calls
  end
end
