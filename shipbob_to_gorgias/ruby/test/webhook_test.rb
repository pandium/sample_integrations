require_relative 'test_helper'
require_relative 'fakes'
require_relative '../webhook'
require 'tmpdir'

class WebhookTest < Minitest::Test
  def test_prune_drops_entries_older_than_window_keeps_recent
    now = Time.utc(2026, 7, 9, 12, 0, 0)
    processed = {
      '1:Delivered' => (now - (10 * 60)).strftime('%Y-%m-%dT%H:%M:%S+00:00'), # 10 min ago -- kept
      '2:Delivered' => (now - (45 * 60)).strftime('%Y-%m-%dT%H:%M:%S+00:00'), # 45 min ago -- dropped
      '3:Delivered' => 'not-a-timestamp', # unparseable -- treated as expired, dropped
    }
    kept = Sb2Gorgias::Webhook.prune(processed, now)
    assert_equal ['1:Delivered'], kept.keys
  end

  def test_shipment_id_falls_through_on_literal_zero
    event = { 'id' => 0, 'shipment_id' => 42 }
    assert_equal '42', Sb2Gorgias::Webhook.shipment_id(event)
  end

  def test_shipment_id_prefers_id_when_present
    assert_equal '5', Sb2Gorgias::Webhook.shipment_id({ 'id' => 5, 'shipment_id' => 42 })
  end

  def test_build_ticket_delivered_event_html_and_text
    event = make_shipment_event
    ticket = Sb2Gorgias::Webhook.build_ticket(event, { 'id' => 1 })
    message = ticket['messages'][0]

    assert_includes message['body_text'], 'Tracking: USPS 9400100000000000000000'
    assert_includes message['body_text'], 'Delivered on: 2026-07-09'
    assert_includes message['body_text'], 'Items:'
    assert_includes message['body_html'], '<p><b>Tracking:</b> USPS 9400100000000000000000</p>'
    refute_includes message['body_html'], 'Delivered on' # HTML never gets this block
    assert_equal [{ 'name' => 'shipbob-shipment' }, { 'name' => 'shipbob-delivered' }], ticket['tags']
  end

  def test_build_ticket_onhold_event_no_tracking_no_email_reason_from_description
    event = make_onhold_event
    ticket = Sb2Gorgias::Webhook.build_ticket(event, { 'id' => 1, 'external_id' => 'Jane Buyer 100 Nowhere Blvd Gotham City US' })
    message = ticket['messages'][0]

    refute_includes message['body_text'], 'Tracking:'
    assert_includes message['body_text'], 'Reason: Invalid Address; Payment Failure'
    assert_equal [{ 'name' => 'shipbob-shipment' }, { 'name' => 'shipbob-onhold' }], ticket['tags']
  end

  def test_run_dedupes_within_a_single_batch
    Dir.mktmpdir do |dir|
      event = make_shipment_event(1)
      triggers = [webhook_trigger(dir, event, 't1'), webhook_trigger(dir, event, 't2')]
      pandium = make_pandium(secrets: GORGIAS_SECRETS, run_triggers: triggers)
      gorgias = recording_gorgias

      result = Sb2Gorgias::Webhook.run(pandium, gorgias: gorgias, now: Time.now.utc)

      assert_equal 1, gorgias.log[:ticket].size
      assert_equal 1, result['processed_events'].size
    end
  end

  def test_run_creates_separate_tickets_for_different_statuses
    Dir.mktmpdir do |dir|
      delivered = make_shipment_event(1, 'Delivered')
      onhold = make_shipment_event(1, 'OnHold')
      triggers = [webhook_trigger(dir, delivered, 't1'), webhook_trigger(dir, onhold, 't2')]
      pandium = make_pandium(secrets: GORGIAS_SECRETS, run_triggers: triggers)

      result = Sb2Gorgias::Webhook.run(pandium, gorgias: recording_gorgias, now: Time.now.utc)

      assert_equal %w[1:Delivered 1:OnHold].sort, result['processed_events'].keys.sort
    end
  end

  def test_run_leaves_event_unprocessed_when_ticket_creation_fails
    Dir.mktmpdir do |dir|
      event = make_shipment_event(1)
      triggers = [webhook_trigger(dir, event, 't1')]
      pandium = make_pandium(secrets: GORGIAS_SECRETS, run_triggers: triggers)
      gorgias = recording_gorgias
      gorgias.define_singleton_method(:create_ticket) { |_payload| raise 'boom' }

      result = Sb2Gorgias::Webhook.run(pandium, gorgias: gorgias, now: Time.now.utc)

      assert_empty result['processed_events']
    end
  end

  def test_run_result_has_only_processed_events_key
    Dir.mktmpdir do |dir|
      pandium = make_pandium(secrets: GORGIAS_SECRETS, run_triggers: [])
      result = Sb2Gorgias::Webhook.run(pandium, gorgias: recording_gorgias, now: Time.now.utc)
      assert_equal ['processed_events'], result.keys
    end
  end
end
