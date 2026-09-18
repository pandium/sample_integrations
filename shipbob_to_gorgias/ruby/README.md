# ShipBob to Gorgias in Ruby

The plain-Ruby implementation of the [ShipBob to Gorgias sample](../README.md). Read that
first for what the integration does and which parts of the Pandium platform it exercises;
this page covers the code, and how to install, run, and test it.

Ruby 3.1+, `Faraday`, `Minitest`. No framework, no web server.

## Layout

```
ruby/
├── PANDIUM.yaml     manifest: runtime, configs, metadata schema
├── Gemfile          dependencies (faraday, faraday-retry, base64)
├── Rakefile         `rake test` target
├── main.rb           entry point; dispatches on run mode
├── lib.rb             the Pandium runtime contract: config, secrets, context, metadata
├── cron.rb               Flow A — resumable order sync
├── webhook.rb              Flow B — shipment status webhook -> ticket, with dedupe
├── shipbob.rb                ShipBob client
├── gorgias.rb                  Gorgias client
└── test/             both flows covered end to end; no network
```

`lib.rb` is the file to read first — the whole platform contract in one file: `PAN_CFG_*`/
`PAN_SEC_*` as plain hashes, `PAN_CTX_*` as named methods, the metadata file read, and the
single stdout write that hands metadata back to Pandium. Everything is wrapped in a
`Sb2Gorgias` module rather than left as bare top-level classes. There's no `lib/`/`app/`
split some Ruby projects use — plain Ruby runs these files directly via `require_relative`,
so `run: ruby main.rb` in `PANDIUM.yaml` just picks up `main.rb` at the project root.

## Implementation notes

**The run-limit deadline** is a background `Thread` in `cron.rb` that sleeps for 9 minutes
then flushes the cursor and exits. Ruby's `Timeout.timeout` was deliberately avoided for this
— it raises an exception asynchronously into whatever the main thread happens to be doing,
which can leave an in-flight HTTP connection in a broken state. A background thread that
exits on its own doesn't have that problem: `Process.exit` from any thread tears down the
whole process regardless of what the main thread is doing at the time.

**`get_update_date` is a pure class method**, not an instance method reading the clock
internally — `now` is passed in explicitly. That lets `get_updated_orders_page` compute each
order's date once (pairing it with the order before sorting) instead of recomputing it on
every comparison, with no memoization cache needed.

**Falsy-fallthrough semantics**: a couple of business-logic paths need to treat `0` as
"nothing here" the way the reference spec's own dynamically-typed source does — Ruby's `||`
only falls through on `nil`/`false`, so `Sb2Gorgias.loose_or` in `lib.rb` covers the
`nil`/`''`/`0`/`false` case explicitly wherever that quirk matters (e.g. a shipment id of
literal `0`).

**Timestamp comparisons are plain string comparisons**, not parsed-datetime comparisons, to
stay resumable across pages: cursors are trimmed to a fixed width (26 or 23 characters,
depending on which cursor) so two timestamps of different precision still compare correctly
lexicographically. The updated-orders cursor is the minimum update date seen across every
page, committed once the whole query is exhausted — not the last order processed, since pages
aren't sorted relative to each other and an unread page could carry an older update.

**`GorgiasAPI`'s POST requests aren't retried on a timeout**, only on a retryable status code
(429/502/503/504). A POST creates a customer or ticket; retrying one after a timeout risks
creating a duplicate if Gorgias actually processed the first attempt and merely responded
late. GET and PUT stay unconditional, since a lookup has no side effect and a full-state
update is safe to repeat either way.

## Prerequisites

- Ruby 3.1+ (this machine's system Ruby predates this — install a newer one via
  `brew install ruby`, `rbenv`, or `asdf` first, and make sure it's the one on `PATH` for the
  commands below)
- Bundler (`gem install bundler` if `bundle` isn't already available)

## Install

```bash
cd ruby
bundle install
```

## Running the tests

The tests cover both flows end to end — including the watchdog flush and the webhook
dedupe — with no network access and no credentials:

```bash
bundle exec rake test
```

`test/fakes.rb` builds a real `Pandium` object directly instead of from the environment, and
swaps the HTTP-backed methods on a real `GorgiasAPI` for in-memory recorders via
`define_singleton_method`, so client helper logic (customer key resolution, payload building)
still runs under test.

## Running it locally

Both flows talk to the live ShipBob and Gorgias APIs, so use sandbox credentials either way.

### With the Pandium CLI

The CLI runs the integration in the current folder using the environment of a real tenant, so
the tenant's provisioned connector secrets are never copied onto your machine. Download it
from the Admin Dashboard under **Settings → Developer Resources**.

```bash
pandium login                          # defaults to sandbox
pandium get integrations               # find your integration id
pandium get tenants -i <integration_id>  # find the tenant id to borrow
```

Then, from this directory:

```bash
pandium local build                       # runs the manifest's build command (bundle install)
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how you
change one config without touching the tenant, and how you hand the CLI a webhook payload to
run against.

### With environment variables directly

Pandium hands every value over as a plain environment variable in production; locally, export
them directly (there's no `.env` loader wired into this port — set them in your shell, or
source a file yourself before running):

```bash
export PAN_SEC_SHIPBOB_ACCESS_TOKEN=eyJ...
export PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN=...
export PAN_SEC_GORGIAS_OAUTH_ACCOUNT=your-store

export PAN_CFG_ORDER_START_DATE=2026-07-01
export PAN_CFG_NEWEST_ORDER_FIRST=false

export PAN_CTX_RUN_MODE=normal
export PAN_CTX_TENANT_METADATA_FILE=./metadata.json
```

Seed the metadata file, then run the cron flow:

```bash
echo '{}' > metadata.json
bundle exec ruby main.rb
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.

### Exercising the webhook flow

Neither route can invent a delivery, so both read the run triggers from the environment — an
array whose `payload.file` points at a body on disk, exactly as Pandium would supply it.
Write one by hand using the same shape the tests use:

```bash
mkdir -p /tmp/wh
cat > /tmp/wh/event.json <<'EOF'
{"id": 456789, "order_id": 289012345, "reference_id": "MERCHANT-ORDER-1001",
 "status": "Delivered", "status_details": [],
 "tracking": {"carrier": "USPS", "tracking_number": "9400100000000000000000"},
 "delivery_date": "2026-07-09T18:22:00Z",
 "products": [{"name": "Pinnacle Shampoo", "sku": "PIN-100",
               "inventory_items": [{"name": "Pinnacle Shampoo", "quantity": 4}]}],
 "recipient": {"name": "Jane Buyer", "email": "jane@example.com",
               "address": {"address1": "100 Nowhere Blvd", "city": "Gotham City", "country": "US"}}}
EOF
export PAN_CTX_RUN_TRIGGERS='[{"id":"t1","source":"webhook","payload":{"file":"/tmp/wh/event.json"}}]'
export PAN_CTX_RUN_MODE=webhook
```

Then run it the same way as above (via the CLI or `bundle exec ruby main.rb` directly).
