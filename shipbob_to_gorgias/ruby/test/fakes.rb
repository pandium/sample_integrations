require 'fileutils'
require 'json'
require 'tmpdir'

require_relative '../lib'
require_relative '../gorgias'

GORGIAS_SECRETS = {
  'gorgias_oauth_access_token' => 'gorgias-token-123',
  'gorgias_oauth_account' => 'acme',
}.freeze

# Builds a Pandium directly (no env). metadata: is written to a tempfile so
# pandium.metadata reads it back for real, matching the file-based contract Pandium uses.
def make_pandium(config: {}, secrets: {}, run_mode: nil, run_triggers: nil, metadata: nil, tmp_dir: nil)
  context = {}
  context['run_mode'] = run_mode if run_mode
  context['run_triggers'] = JSON.generate(run_triggers) if run_triggers
  if metadata
    raise 'tmp_dir is required when metadata is given' unless tmp_dir

    file = File.join(tmp_dir, 'metadata.json')
    File.write(file, JSON.generate(metadata))
    context['tenant_metadata_file'] = file
  end
  Sb2Gorgias::Pandium.new(config, secrets, context)
end

# Serves canned pages for either half and records the pages asked for.
#
# on_page runs before a page is served, which is where a test stands in for the watchdog
# firing or the API going away mid-query.
class FakeShipBobClient
  attr_reader :pages

  def initialize(new_pages: [], updated_pages: [], on_page: nil)
    @new_pages = new_pages
    @updated_pages = updated_pages
    @on_page = on_page || ->(_half, _page) {}
    @pages = { 'new' => [], 'updated' => [] }
  end

  def get_new_orders_page(_start_date, page)
    serve_page('new', @new_pages, page)
  end

  def get_updated_orders_page(_start_date, page)
    serve_page('updated', @updated_pages, page)
  end

  private

  def serve_page(half, all_pages, page)
    @pages[half] << page
    @on_page.call(half, page)
    page <= all_pages.size ? all_pages[page - 1] : []
  end
end

# A real GorgiasAPI (so customer_key/valid_email/etc. run for real) with its HTTP-backed
# methods replaced by in-memory recorders. existing_emails are pre-seeded as found customers;
# inspect gorgias.log in assertions.
def recording_gorgias(existing_emails: [])
  api = Sb2Gorgias::GorgiasAPI.new(make_pandium(secrets: GORGIAS_SECRETS))
  store = {}
  existing_emails.each_with_index { |email, i| store[email] = 40 + i }
  log = { create: [], update: [], ticket: [] }

  api.define_singleton_method(:find_customer) do |email: nil, external_id: nil|
    key = (email && !email.empty?) ? email : external_id
    key && store.key?(key) ? { 'id' => store[key], 'data' => { 'pandium' => { 'shipbob_orders' => [] } } } : nil
  end

  api.define_singleton_method(:create_customer) do |payload|
    cid = 1000 + store.size
    store[payload['external_id'] || cid] = cid
    log[:create] << payload
    cid
  end

  api.define_singleton_method(:update_customer) do |cust_id, payload|
    log[:update] << [cust_id, Marshal.load(Marshal.dump(payload))] # snapshot
    nil
  end

  api.define_singleton_method(:create_ticket) do |payload|
    log[:ticket] << payload
    { 'id' => 900 + log[:ticket].size }
  end

  api.define_singleton_method(:log) { log }
  api
end

def make_order(id, created, email: nil, last_update: nil)
  {
    'id' => id,
    'created_date' => created,
    'reference_id' => "REF-#{id}",
    'recipient' => {
      'email' => email,
      'name' => 'Buyer',
      'address' => { 'address1' => '1 Main St', 'city' => 'NY', 'country' => 'US' },
    },
    'shipments' => [{ 'id' => id * 10, 'last_update_at' => last_update || created }],
  }
end

def make_shipment_event(shipment_id = 456_789, status = 'Delivered', email = 'jane@example.com', status_details = [])
  {
    'id' => shipment_id,
    'order_id' => 289_012_345,
    'reference_id' => 'MERCHANT-ORDER-1001',
    'status' => status,
    'status_details' => status_details,
    'tracking' => { 'carrier' => 'USPS', 'tracking_number' => '9400100000000000000000' },
    'delivery_date' => '2026-07-09T18:22:00Z',
    'products' => [
      {
        'name' => 'Pinnacle Shampoo',
        'sku' => 'PIN-100',
        'inventory_items' => [{ 'name' => 'Pinnacle Shampoo', 'quantity' => 4 }],
      },
    ],
    'recipient' => {
      'name' => 'Jane Buyer',
      'email' => email,
      'address' => { 'address1' => '100 Nowhere Blvd', 'city' => 'Gotham City', 'country' => 'US' },
    },
  }
end

# An OnHold shipment: status details, no tracking, and no recipient email.
def make_onhold_event(shipment_id = 107_414_278)
  event = make_shipment_event(shipment_id, 'OnHold', nil, [
                                 { 'id' => 401, 'name' => 'InvalidAddress', 'description' => 'Invalid Address' },
                                 { 'id' => 400, 'name' => 'PaymentDeclined', 'description' => 'Payment Failure' },
                               ])
  event['tracking'] = nil
  event['delivery_date'] = nil
  event
end

# Writes an event to disk and wraps it in a trigger, the way Pandium hands one over.
def webhook_trigger(tmp_dir, event, id, source: 'webhook')
  file = File.join(tmp_dir, "#{id}.json")
  File.write(file, JSON.generate(event))
  { 'id' => id, 'source' => source, 'payload' => { 'file' => file } }
end
