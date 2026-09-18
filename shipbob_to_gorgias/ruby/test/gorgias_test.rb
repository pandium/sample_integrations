require_relative 'test_helper'
require_relative 'fakes'
require 'faraday'

class GorgiasTest < Minitest::Test
  def setup
    @api = Sb2Gorgias::GorgiasAPI.new(make_pandium(secrets: GORGIAS_SECRETS))
  end

  # Regression tests: an absolute path ('/customers') resolved against a base URL that has
  # its own path segment (".../api") replaces that segment instead of appending to it, per
  # RFC 3986 merge rules -- silently dropping "/api" and hitting the bare account host,
  # which 401s instead of routing to the API. Every @conn call must use a relative path.

  # Swaps @api's connection for a Faraday test connection stubbed for one request, and
  # returns the path actually requested.
  def stub_request(method, stub_path, body: '{}')
    requested_path = nil
    stubs = Faraday::Adapter::Test::Stubs.new
    stubs.public_send(method, stub_path) do |env|
      requested_path = env.url.path
      [200, {}, body]
    end
    @api.instance_variable_set(:@conn, Faraday.new(url: 'https://acme.gorgias.com/api') { |f| f.adapter :test, stubs })
    yield
    stubs.verify_stubbed_calls
    requested_path
  end

  def test_find_customer_requests_the_api_prefixed_customers_path
    path = stub_request(:get, '/api/customers', body: JSON.generate({ 'data' => [] })) do
      @api.find_customer(email: 'jane@example.com')
    end
    assert_equal '/api/customers', path
  end

  def test_find_customer_detail_lookup_requests_the_api_prefixed_customers_path
    detail_path = nil
    stubs = Faraday::Adapter::Test::Stubs.new
    stubs.get('/api/customers') { [200, {}, JSON.generate({ 'data' => [{ 'id' => 42 }] })] }
    stubs.get('/api/customers/42') do |env|
      detail_path = env.url.path
      [200, {}, JSON.generate({ 'id' => 42 })]
    end
    @api.instance_variable_set(:@conn, Faraday.new(url: 'https://acme.gorgias.com/api') { |f| f.adapter :test, stubs })

    @api.find_customer(email: 'jane@example.com')

    assert_equal '/api/customers/42', detail_path
    stubs.verify_stubbed_calls
  end

  def test_create_customer_requests_the_api_prefixed_customers_path
    path = stub_request(:post, '/api/customers', body: JSON.generate({ 'id' => 1 })) do
      @api.create_customer({ 'name' => 'Jane' })
    end
    assert_equal '/api/customers', path
  end

  def test_update_customer_requests_the_api_prefixed_customers_path
    path = stub_request(:put, '/api/customers/7') do
      @api.update_customer(7, { 'name' => 'Jane' })
    end
    assert_equal '/api/customers/7', path
  end

  def test_create_ticket_requests_the_api_prefixed_tickets_path
    path = stub_request(:post, '/api/tickets', body: JSON.generate({ 'id' => 1 })) do
      @api.create_ticket({ 'subject' => 'hi' })
    end
    assert_equal '/api/tickets', path
  end

  # A POST that times out is NOT retried - Gorgias may have already processed it, and
  # retrying could create a duplicate customer/ticket. A POST that gets back a retryable
  # status code (429/502/503/504) still retries, since that's Gorgias itself saying try again.
  def test_post_is_not_retried_on_timeout_but_is_retried_on_a_retryable_status
    timeout_attempts = 0
    stubs_timeout = Faraday::Adapter::Test::Stubs.new
    stubs_timeout.post('/api/tickets') { timeout_attempts += 1; raise Faraday::TimeoutError, 'timed out' }
    @api.instance_variable_set(:@conn, Faraday.new(url: 'https://acme.gorgias.com/api') do |f|
      f.request :retry, max: 3, interval: 0, retry_statuses: [429, 502, 503, 504], methods: %i[get put],
                         retry_if: ->(_env, exception) { exception.is_a?(Faraday::RetriableResponse) }
      f.adapter :test, stubs_timeout
    end)
    assert_raises(Faraday::TimeoutError) { @api.create_ticket({ 'subject' => 'hi' }) }
    assert_equal 1, timeout_attempts

    status_attempts = 0
    stubs_status = Faraday::Adapter::Test::Stubs.new
    stubs_status.post('/api/tickets') { status_attempts += 1; [503, {}, 'unavailable'] }
    @api.instance_variable_set(:@conn, Faraday.new(url: 'https://acme.gorgias.com/api') do |f|
      f.request :retry, max: 3, interval: 0, retry_statuses: [429, 502, 503, 504], methods: %i[get put],
                         retry_if: ->(_env, exception) { exception.is_a?(Faraday::RetriableResponse) }
      f.adapter :test, stubs_status
    end)
    assert_raises(RuntimeError) { @api.create_ticket({ 'subject' => 'hi' }) }
    assert_equal 4, status_attempts # 1 + 3 retries
  end

  def test_valid_email_accepts_bare_addresses_and_rejects_everything_else
    [
      'jane@example.com',
      'jane.buyer@example.com',
      'a@[192.168.1.1]',
      '"quoted string"@example.com',
    ].each do |email|
      assert_equal email, @api.valid_email(email), "expected #{email.inspect} to be valid"
    end

    ['', 'not-an-email', 'jane@@example.com', 'jane.@example.com', 'display.@example.com'].each do |email|
      assert_equal '', @api.valid_email(email), "expected #{email.inspect} to be invalid"
    end
  end

  def test_valid_email_rejects_display_name_form
    assert_equal '', @api.valid_email('Jane Doe <jane@example.com>')
  end

  def test_format_date_normal_utc_seven_digit_fraction
    assert_equal '09/07/2026 18:22:00 UTC', Sb2Gorgias.format_date('2026-07-09T18:22:00.1234567+00:00')
  end

  def test_format_date_whole_second_no_fraction
    assert_equal '09/07/2026 18:22:00 UTC', Sb2Gorgias.format_date('2026-07-09T18:22:00+00:00')
  end

  def test_format_date_naive_no_offset_has_no_tzname
    assert_equal '09/07/2026 18:22:00', Sb2Gorgias.format_date('2026-07-09T18:22:00')
  end

  def test_format_date_non_utc_offset
    assert_equal '09/07/2026 18:22:00 UTC-05:00', Sb2Gorgias.format_date('2026-07-09T18:22:00-05:00')
  end

  def test_format_date_unparseable_returns_original_value
    assert_equal 'not-a-date', Sb2Gorgias.format_date('not-a-date')
  end

  def test_format_date_empty_or_nil_returns_empty_string
    assert_equal '', Sb2Gorgias.format_date('')
    assert_equal '', Sb2Gorgias.format_date(nil)
  end

  def test_customer_key_is_email_or_synthetic
    with_email = { 'recipient' => { 'email' => 'jane@example.com', 'name' => 'Jane', 'address' => {} } }
    assert_equal 'jane@example.com', @api.customer_key(with_email)

    no_email = {
      'recipient' => {
        'name' => 'Jane Buyer',
        'address' => { 'address1' => '100 Nowhere Blvd', 'city' => 'Gotham City', 'country' => 'US' },
      },
    }
    assert_equal 'Jane Buyer 100 Nowhere Blvd Gotham City US', @api.customer_key(no_email)

    sparse = { 'recipient' => { 'name' => 'Buyer', 'address' => { 'address1' => '1 Main St', 'city' => 'NY', 'country' => 'US' } } }
    assert_equal 'Buyer 1 Main St NY US', @api.customer_key(sparse)
  end

  def test_new_customer_payload_omits_email_key_entirely_when_no_valid_email
    order = { 'recipient' => { 'name' => 'Buyer', 'address' => {} } }
    payload = @api.new_customer_payload(order, 'Buyer')
    refute payload.key?('email')
  end

  def test_new_customer_payload_includes_email_when_valid
    order = { 'recipient' => { 'email' => 'jane@example.com', 'name' => 'Jane', 'address' => {} } }
    payload = @api.new_customer_payload(order, 'jane@example.com')
    assert_equal 'jane@example.com', payload['email']
  end
end
