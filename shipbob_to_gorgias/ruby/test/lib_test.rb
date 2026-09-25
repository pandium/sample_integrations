require_relative 'test_helper'
require_relative 'fakes'
require 'stringio'
require 'tmpdir'

class LibTest < Minitest::Test
  def test_run_triggers_falls_back_to_empty_on_bad_json
    pandium = make_pandium
    pandium.instance_variable_get(:@context)['run_triggers'] = 'not json'
    assert_equal [], pandium.run_triggers
  end

  def test_run_triggers_empty_when_absent
    assert_equal [], make_pandium.run_triggers
  end

  def test_webhook_deliveries_filters_on_source_not_mode
    Dir.mktmpdir do |dir|
      good = webhook_trigger(dir, { 'a' => 1 }, 't1', source: 'webhook')
      wrong_source = { 'id' => 't2', 'mode' => 'webhook', 'source' => 'cron', 'payload' => { 'file' => good['payload']['file'] } }
      pandium = make_pandium(run_triggers: [good, wrong_source])

      deliveries = pandium.webhook_deliveries
      assert_equal 1, deliveries.size
      assert_equal 't1', deliveries[0].id
      assert_equal JSON.generate({ 'a' => 1 }), deliveries[0].body
    end
  end

  def test_webhook_deliveries_skips_trigger_with_no_payload_file
    trigger = { 'id' => 't1', 'source' => 'webhook', 'payload' => {} }
    pandium = make_pandium(run_triggers: [trigger])
    assert_equal [], pandium.webhook_deliveries
  end

  def test_metadata_is_memoized
    Dir.mktmpdir do |dir|
      pandium = make_pandium(metadata: { 'x' => 1 }, tmp_dir: dir)
      first = pandium.metadata
      File.write(File.join(dir, 'metadata.json'), JSON.generate({ 'x' => 2 }))
      assert_same first, pandium.metadata
    end
  end

  def test_metadata_nil_when_missing_or_malformed
    assert_nil make_pandium.metadata

    Dir.mktmpdir do |dir|
      file = File.join(dir, 'bad.json')
      File.write(file, 'not json')
      pandium = Sb2Gorgias::Pandium.new({}, {}, { 'tenant_metadata_file' => file })
      assert_nil pandium.metadata
    end
  end

  def test_update_metadata_writes_exactly_one_json_line_to_stdout
    pandium = make_pandium
    original_stdout = $stdout
    $stdout = StringIO.new
    begin
      pandium.update_metadata({ 'a' => 1 })
      lines = $stdout.string.split("\n")
      assert_equal 1, lines.size
      assert_equal({ 'a' => 1 }, JSON.parse(lines[0]))
    ensure
      $stdout = original_stdout
    end
  end
end
