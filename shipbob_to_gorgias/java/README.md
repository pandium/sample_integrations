# ShipBob to Gorgias in Java

The Java implementation of the [ShipBob to Gorgias sample](../README.md). Read that first
for what the integration does and which parts of the Pandium platform it exercises; this page
covers the code, and how to build, run, and test it.

Java 25, Maven, `unirest-java`, `org.json`, JUnit 5. No framework, no web server.

## Layout

```
java/
├── PANDIUM.yaml                     manifest: runtime, configs, metadata schema
├── pom.xml                          dependencies (unirest-java, org.json, JUnit)
├── src/main/java/sb2gorgias/
│   ├── Main.java                     entry point; dispatches on run mode
│   ├── Lib.java                       the Pandium runtime contract: config, secrets, context, metadata
│   ├── HttpClient.java                 hand-rolled retry client (Unirest has no built-in backoff)
│   ├── Cron.java                      Flow A — resumable order sync
│   ├── Webhook.java                   Flow B — shipment status webhook -> ticket, with dedupe
│   ├── ShipBobClient.java / ShipBobApi.java    ShipBob client
│   └── GorgiasClient.java / GorgiasApi.java    Gorgias client
└── src/test/java/sb2gorgias/         both flows covered end to end; no network
```

`Lib.java` is the file to read first — the whole platform contract in one file: `PAN_CFG_*`/
`PAN_SEC_*` as plain maps, `PAN_CTX_*` as named methods, the metadata file read, and the
single stdout write that hands metadata back to Pandium. It also defines `newLogger`, which
every other file gets its own named `java.util.logging.Logger` instance from.

`ShipBobClient`/`GorgiasClient` exist because Java has no runtime monkey-patching — `Cron`
and `Webhook` depend on the interfaces, production wiring uses the real `*Api` classes, and
tests use hand-written fakes implementing the same interfaces.

## Implementation notes

**The run-limit deadline** is a `ScheduledExecutorService`-based watchdog in `Cron.java`,
injectable via `Cron.Deps` so tests can trigger it deterministically without waiting 9 real
minutes. Because it runs on a real background thread in production, the cursor state it
shares with the paging loop (`Cron.CursorState`) only exposes `synchronized` accessors —
every read, including log lines, goes through them.

**No hand-rolled numeric-id formatting is needed.** `org.json` decodes JSON integers as
`Integer`/`Long`, never `Double`, so there's no scientific-notation risk when an id gets
embedded in a URL or a dedupe key — a class of bug some other ports here had to guard against
explicitly.

**Update-date comparison and sorting use real `java.time.OffsetDateTime`** instead of string
comparison, since ShipBob's per-shipment `last_update_at` needs to be compared and sorted
correctly regardless of exact string format. The cursor values written back into tenant
metadata are still formatted to match every other port's shape exactly (6-digit microseconds,
no offset suffix) — that's a wire format other tenants' stored metadata already relies on,
not a place to diverge.

**Date formatting for the customer sidebar** works on the raw ISO string with a regex instead
of a full parse, in `GorgiasApi.java` — ShipBob timestamps are UTC-only and this is a
display-only value, so a full `java.time` parse would be more work for no behavioral gain.

**HTTP retry** is hand-rolled in `HttpClient.java` (exponential backoff, a small set of
retryable status codes) because `unirest-java` has no retry support of its own — the same gap
Go's port had to fill for its own HTTP stack.

## Prerequisites

- Java 25 (e.g. `brew install openjdk@25`)
- Maven (e.g. `brew install maven`)

## Building

```bash
cd java
mvn clean package
```

## Running the tests

The tests cover both flows end to end — including the timeout flush and the webhook dedupe —
with no network access and no credentials:

```bash
mvn test
```

`src/test/java/sb2gorgias/Helpers.java` builds a real `Pandium` directly instead of from the
environment, and `FakeShipBobClient`/`FakeGorgiasClient` implement the client interfaces
in-memory, so client helper logic (customer key resolution, payload building) still runs
under test.

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
pandium local build                       # runs the manifest's build command (mvn clean package)
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how you
change one config without touching the tenant, and how you hand the CLI a webhook payload to
run against.

### With environment variables directly

Pandium hands every value over as a plain environment variable in production — no `.env`
loader is built into this port, so export them directly:

```bash
export PAN_SEC_SHIPBOB_ACCESS_TOKEN=eyJ...
export PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN=...
export PAN_SEC_GORGIAS_OAUTH_ACCOUNT=your-store

export PAN_CFG_ORDER_START_DATE=2026-07-01
export PAN_CFG_NEWEST_ORDER_FIRST=false

export PAN_CTX_RUN_MODE=normal
export PAN_CTX_TENANT_METADATA_FILE=./metadata.json
```

Seed the metadata file, build, then run the cron flow:

```bash
echo '{}' > metadata.json
mvn -q clean package -DskipTests
java -jar target/sb2gorgias-1.0-jar-with-dependencies.jar
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

Then run it the same way as above (via the CLI or the built jar directly).
