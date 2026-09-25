require_relative 'test_helper'
require_relative 'fakes'

# Guards against the cron and webhook flows drifting on customer-key derivation, since both
# call GorgiasAPI#customer_key against differently-shaped payloads (an order vs. a shipment
# event) that happen to share the same recipient.* structure.
class ParityTest < Minitest::Test
  def test_customer_key_matches_across_order_and_shipment_event_for_the_same_recipient
    api = Sb2Gorgias::GorgiasAPI.new(make_pandium(secrets: GORGIAS_SECRETS))
    order = make_order(1, '2026-07-01T00:00:00', email: 'jane@example.com')
    event = make_shipment_event(1, 'Delivered', 'jane@example.com')

    assert_equal api.customer_key(order), api.customer_key(event)
  end

  def test_customer_key_matches_for_synthetic_key_too
    api = Sb2Gorgias::GorgiasAPI.new(make_pandium(secrets: GORGIAS_SECRETS))
    recipient = { 'name' => 'Buyer', 'address' => { 'address1' => '1 Main St', 'city' => 'NY', 'country' => 'US' } }
    order = { 'recipient' => recipient }
    event = { 'recipient' => recipient }

    assert_equal 'Buyer 1 Main St NY US', api.customer_key(order)
    assert_equal api.customer_key(order), api.customer_key(event)
  end
end
