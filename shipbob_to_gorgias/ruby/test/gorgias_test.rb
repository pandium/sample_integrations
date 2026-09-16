require_relative 'test_helper'
require_relative 'fakes'

class GorgiasTest < Minitest::Test
  def setup
    @api = Sb2Gorgias::GorgiasAPI.new(make_pandium(secrets: GORGIAS_SECRETS))
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
