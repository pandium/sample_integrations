# ShipBob to Gorgias in Rust

The Rust implementation of the [ShipBob to Gorgias sample](../README.md). Read that first
for what the integration does and which parts of the Pandium platform it exercises; this
page covers the code, and how to build, run, and test it.

Rust 1.97, `cargo`, `ureq`. No framework, no web server, no async runtime — the run is
sequential from start to finish, so blocking calls keep it readable.

## Layout

```
rust/
├── PANDIUM.yaml            manifest: runtime, connectors, configs, metadata schema
├── Cargo.toml              dependencies
├── src/
│   ├── main.rs             entry point; dispatches on run mode
│   ├── lib.rs              module wiring
│   ├── pandium.rs          the Pandium runtime contract: config, secrets, context, metadata
│   ├── cron.rs             Flow A — resumable order sync
│   ├── webhook.rs          Flow B — shipment status webhook → ticket, with dedupe
│   ├── shipbob.rs          ShipBob client, and the ShipBob shapes we read
│   ├── gorgias.rs          Gorgias client, customer key, payload builders
│   ├── http.rs             bearer auth and retry, shared by both clients
│   ├── dates.rs            timestamp parsing and formatting
│   └── fakes.rs            test doubles (compiled only under `cfg(test)`)
└── (the tests live in `#[cfg(test)] mod tests` blocks at the foot of cron.rs and webhook.rs)
```

`pandium.rs` is the file to read first. It is the whole platform contract in a single
file: `PAN_CFG_*` and `PAN_SEC_*` as named lookups, `PAN_CTX_*` as typed accessors, the
metadata file read, and the single stdout write that hands metadata back to Pandium.

## Rust implementation details

**The run-limit deadline** is a watchdog thread rather than a signal handler. The sync
loop and the watchdog share one cursor behind a `Mutex`, so whenever the watchdog wakes it
writes whatever the loop had reached (`src/cron.rs`):

```rust
fn flush_at_deadline(cursors: Arc<Mutex<Cursors>>, deadline: Duration) {
    thread::spawn(move || {
        thread::sleep(deadline);
        log::warn!("approaching the run-time limit — flushing the cursor for the next run");
        // The same writer the normal path uses, so there is exactly one route to
        // stdout, and exit 0 so Pandium counts the run as a success and merges
        // the partial cursor.
        pandium::update_metadata(&cursors.lock().unwrap().as_metadata());
        process::exit(0);
    });
}
```

There is nothing to cancel on the way out — a detached thread dies with the process when
`main` returns, which is this design's answer to Python's `signal.alarm(0)`.

**Mode dispatch** is a `match` on `PAN_CTX_RUN_MODE` in `src/main.rs`:

```rust
let metadata = match mode {
    "webhook" => webhook::run(&pandium),   // Flow B — shipment status → ticket
    _ => cron::run(&pandium),              // Flow A — scheduled order sync
};
```

**Two styles of deserialization**, chosen by what each flow does with the data:

- A **webhook body** is small, fully specified, and every field drives a decision, so it
  gets real types (`shipbob::Shipment`). Modelling `tracking` as `Option<Tracking>` is
  what makes "only mention tracking when ShipBob sent some" a compiler-checked
  `if let Some(tracking) = &event.tracking` instead of a runtime lookup that might be
  `None`, `null`, or missing.
- An **order** is mostly *passed through* to the Gorgias sidebar unread, so it stays raw
  `serde_json::Value`, and only the parts the integration acts on are pulled out.
  `serde_json` deserializes straight out of a borrowed `Value`, so extracting one typed
  field from otherwise-untyped JSON costs nothing but the strings it copies:

  ```rust
  impl Recipient {
      pub fn of(order: &Value) -> Self {
          Self::deserialize(&order["recipient"]).unwrap_or_default()
      }
  }
  ```

Indexing a `Value` yields `Value::Null` for anything missing rather than panicking, which
is why there is no `deep_get` helper here: `order["recipient"]["address"]["city"]` already
does what the Python version needs a function for.

**The customer key is an enum.** A ShipBob recipient often has no usable email, so both
flows fall back to a synthetic key built from the recipient's name and address. Making
that a `CustomerKey::Email | CustomerKey::ExternalId` rather than a pair of optional
arguments means there is always exactly one key, and the lookup and the created record
cannot disagree about it.

**Both flows split in two.** `run` reads the environment and builds the API clients;
`sync` and `process` take the `Orders` and `Helpdesk` traits and hold the actual logic.
The tests drive the second half with in-memory doubles, so the flow's real logic runs
without a network, a token, or an environment variable.

## Prerequisites

- Rust 1.97 ([rustup](https://rustup.rs/))

## Build

```bash
cd rust
cargo build --release
```

## Running the tests

Six tests, one per behaviour worth understanding before you copy this sample. They run
both flows end to end with no network access and no credentials:

```bash
cargo test
```

```
running 6 tests
test cron::tests::the_sync_pages_until_empty_and_keeps_the_cursor_current_as_it_goes ... ok
test cron::tests::the_updated_cursor_lands_on_the_oldest_update_across_every_page ... ok
test cron::tests::a_page_that_fails_to_fetch_ends_the_run_rather_than_committing_a_cursor ... ok
test webhook::tests::a_delivery_opens_a_ticket_and_writes_only_processed_events ... ok
test webhook::tests::a_repeated_status_is_dropped_but_the_next_status_still_tickets ... ok
test webhook::tests::a_recipient_with_no_email_gets_a_customer_keyed_on_their_address ... ok

test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

`src/fakes.rs` implements the same `Orders` and `Helpdesk` traits the real clients do, so
the flows under test run their real logic — only the API calls at the edges are swapped
for in-memory recorders. It is behind `#[cfg(test)]`, so none of it reaches the binary.

## Running it locally

Both flows talk to the live ShipBob and Gorgias APIs, so use sandbox credentials either way.

### With the Pandium CLI

The CLI runs the integration in the current folder using the environment of a real tenant,
so the tenant's provisioned connector secrets are never copied onto your machine. Download
it from the Admin Dashboard under **Settings → Developer Resources**.

```bash
pandium login                            # defaults to sandbox
pandium get integrations                 # find your integration id
pandium get tenants -i <integration_id>  # find the tenant id to borrow
```

Then, from this directory:

```bash
pandium local build                       # runs the manifest's build command (cargo build --release)
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how
you change one config without touching the tenant, and how you hand the CLI a webhook
payload to run against.

### With a `.env` file

`main` loads a `.env` from the working directory when there is one, which is the same
mechanism Pandium uses in production — environment variables, nothing else. Create
`rust/.env`:

```properties
PAN_SEC_SHIPBOB_ACCESS_TOKEN=eyJ...
PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN=...
PAN_SEC_GORGIAS_OAUTH_ACCOUNT=your-store

PAN_CFG_ORDER_START_DATE=2026-07-01
PAN_CFG_NEWEST_ORDER_FIRST=false

PAN_CTX_RUN_MODE=normal
PAN_CTX_TENANT_METADATA_FILE=./metadata.json
```

Seed the metadata file, then run the cron flow:

```bash
echo '{}' > metadata.json
cargo run --release
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.

Set `RUST_LOG=debug` for more, or `RUST_LOG=warn` for less — `env_logger` reads it, and
the default is `info`.

### Exercising the webhook flow

Neither route can invent a delivery, so both read the run triggers from `.env` — an array
whose `payload.file` points at a body on disk, exactly as Pandium would supply it. Write
one out:

```bash
mkdir -p /tmp/wh && cat > /tmp/wh/t1.json <<'JSON'
{"id": 107414278, "order_id": 23517384, "reference_id": "MERCHANT-ORDER-1001",
 "status": "OnHold",
 "status_details": [{"id": 401, "name": "InvalidAddress", "description": "Invalid Address"}],
 "tracking": null, "delivery_date": null,
 "products": [{"name": "16 oz. Pinnacle Bodywork Shampoo", "sku": "PIN-100",
               "inventory_items": [{"quantity": 4}]}],
 "recipient": {"name": "John Doe", "email": null,
               "address": {"address1": "100 Nowhere Blvd", "city": "Gotham City", "country": "US"}}}
JSON
```

That is the harder shape — status details, no tracking, no recipient email — so it
exercises the `external_id` customer path. Change `status` to `Delivered` and add a
`tracking` object to see the other one. Add the trigger array to `.env`:

```properties
PAN_CTX_RUN_TRIGGERS=[{"id":"t1","source":"webhook","mode":"webhook","payload":{"file":"/tmp/wh/t1.json"}}]
```

Then run it either way — via the CLI with `pandium local run <tenant_id> -m webhook`, or on
its own by flipping `PAN_CTX_RUN_MODE` to `webhook` in `.env` and running the binary again.

> Keep `.env` out of version control — it is already in `rust/.gitignore`.

## Rust-specific notes

- `MAX_ORDERS_TO_SYNC` in `cron.rs` caps how many orders are retained per customer (10).
- `clamp()` in `cron.rs` is what enforces the 30-day floor the connection-settings form
  promises; the manifest does not constrain the date itself.
- `dates::parse` normalises every timestamp to naive UTC, so cursor comparisons never have
  to think about offsets. Between them the two APIs and the settings form send RFC 3339
  with an offset, the same without one, and a bare `2026-07-01`.
- `http::Client` retries 429, 502, 503, and 504 with a doubling backoff. Pandium does not
  retry a failed run on its own, so a transient rate limit has to be absorbed there or the
  whole run is lost.
- Every fallible path returns `anyhow::Result`, and `main` turns an error into a non-zero
  exit with nothing on stdout — which leaves the tenant's stored metadata exactly as the
  last successful run left it. `Orders` returns `Result<Vec<Value>>` for that reason —
  an exhausted query (commit the cursor) and a failed fetch (commit nothing) have to
  stay distinguishable.
