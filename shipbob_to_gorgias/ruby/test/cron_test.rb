require_relative 'test_helper'
require_relative 'fakes'
require_relative '../cron'
require 'stringio'
require 'time'

class CronTest < Minitest::Test
  # Ruby's `loop do ... end` silently catches StopIteration and exits the loop normally, so a
  # sentinel used to escape Cron.run's paging loops from a test must be some other class.
  class SimulatedExit < StandardError; end

  def ago(days)
    (Time.now.utc - (days * 24 * 60 * 60)).strftime('%Y-%m-%dT%H:%M:%S') + '.1234567+00:00'
  end

  def test_clamp_bounds_cursor_between_one_month_ago_and_now
    now = Time.utc(2026, 7, 16, 12, 0, 0)
    assert_equal Time.utc(2026, 7, 10), Sb2Gorgias::Cron.clamp('2026-07-10T00:00:00', now)
    assert_equal now, Sb2Gorgias::Cron.clamp('2099-01-01T00:00:00', now)
    assert_equal now - Sb2Gorgias::Cron::ONE_MONTH_SECONDS, Sb2Gorgias::Cron.clamp(nil, now)
  end

  def test_upsert_replaces_in_place_without_resort
    orders = [{ 'id' => 5 }, { 'id' => 1 }] # deliberately unsorted
    result = Sb2Gorgias::Cron.upsert(orders, { 'id' => 1, 'updated' => true }, false)
    assert_equal [{ 'id' => 5 }, { 'id' => 1, 'updated' => true }], result # order preserved, not re-sorted
  end

  def test_upsert_appends_sorts_by_id_and_trims
    orders = (1..10).map { |i| { 'id' => i } }
    result = Sb2Gorgias::Cron.upsert(orders, { 'id' => 11 }, true)
    assert_equal 10, result.size
    assert_equal 11, result.first['id']
    assert_equal 2, result.last['id'] # id 1 trimmed off
  end

  def test_run_pages_until_empty_upserts_customer_and_advances_cursor
    shipbob = FakeShipBobClient.new(
      new_pages: [[make_order(1, ago(6), email: 'jane@example.com'), make_order(2, ago(5), email: 'jane@example.com')]],
      updated_pages: []
    )
    gorgias = recording_gorgias
    pandium = make_pandium(secrets: GORGIAS_SECRETS, config: { 'order_start_date' => ago(20) })

    record = Sb2Gorgias::Cron.run(pandium, shipbob: shipbob, gorgias: gorgias, now: Time.now.utc)

    assert_equal [1, 2], shipbob.pages['new'] # paged until the empty page confirmed exhaustion
    assert_equal 1, gorgias.log[:create].size # both orders batch onto one customer
    assert_equal ago(5)[0, 26], record['new_order_start_date']

    final_orders = gorgias.log[:update].last[1]['data']['pandium']['shipbob_orders']
    assert_equal [1, 2], final_orders.map { |o| o['id'] }.sort
  end

  def test_run_advances_updated_cursor_to_oldest_update_across_pages
    shipbob = FakeShipBobClient.new(
      new_pages: [],
      updated_pages: [
        [make_order(1, ago(2), email: 'j@x.com'), make_order(2, ago(3), email: 'j@x.com')],
        [make_order(3, ago(9), email: 'j@x.com'), make_order(4, ago(8), email: 'j@x.com')],
        [make_order(5, ago(4), email: 'j@x.com')],
      ]
    )
    pandium = make_pandium(secrets: GORGIAS_SECRETS, config: { 'order_start_date' => ago(20) })

    record = Sb2Gorgias::Cron.run(pandium, shipbob: shipbob, gorgias: recording_gorgias, now: Time.now.utc)

    # get_update_date passes the raw shipment timestamp through untouched (only truncated to
    # 23 chars), so the expected value is a plain slice of the fixture string, not a
    # parsed-and-reformatted one.
    assert_equal ago(9)[0, 23], record['updated_order_start_date'] # not order 5, the last processed
  end

  # A watchdog firing mid-run is still a success: it flushes the completed half's progress and
  # leaves the interrupted half at its starting cursor, the same success path as a run that
  # finishes on its own.
  def test_watchdog_flushes_the_finished_half_and_leaves_the_interrupted_one
    start = ago(20)
    captured_timeout = nil
    arm_watchdog = lambda do |_seconds, &on_timeout|
      captured_timeout = on_timeout
      -> {} # cancel: no-op, nothing to test here
    end

    shipbob = FakeShipBobClient.new(
      new_pages: [[make_order(1, ago(6), email: 'j@x.com')]],
      updated_pages: [
        [make_order(2, ago(2), email: 'j@x.com')],
        [make_order(3, ago(9), email: 'j@x.com')], # never read
      ],
      on_page: lambda do |half, page|
        captured_timeout.call if half == 'updated' && page == 2
      end
    )
    pandium = make_pandium(secrets: GORGIAS_SECRETS, config: { 'order_start_date' => start })

    original_stdout = $stdout
    $stdout = StringIO.new
    exit_code = nil
    begin
      Sb2Gorgias::Cron.run(pandium, shipbob: shipbob, gorgias: recording_gorgias, arm_watchdog: arm_watchdog,
                                     exit_fn: ->(code) { exit_code = code; raise SimulatedExit },
                                     now: Time.now.utc)
    rescue SimulatedExit
      nil # the watchdog fired mid-page and stopped the run via the injected exit_fn
    ensure
      flushed = JSON.parse($stdout.string.strip)
      $stdout = original_stdout
    end

    assert_equal 0, exit_code # a timed-out run still counts as successful
    assert_equal ago(6)[0, 26], flushed['new_order_start_date'] # that half finished
    assert_equal start[0, 26], flushed['updated_order_start_date'] # this one did not
  end
end
