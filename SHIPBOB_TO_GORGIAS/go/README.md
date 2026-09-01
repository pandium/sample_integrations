# ShipBob to Gorgias in Go

The Go implementation of the [ShipBob to Gorgias sample](../README.md). Read that first
for what the integration does and which parts of the Pandium platform it exercises; this
page covers the code, and how to build, run, and test it.

Go 1.26, standard library only — no third-party dependencies at all. No framework, no web
server.

## Layout

```
go/
├── PANDIUM.yaml     manifest: runtime, connectors, configs, metadata schema
├── go.mod           module sb2gorgias, no dependencies
├── lib.go            the Pandium runtime contract: config, secrets, context, metadata, logger
├── http.go            shared retry/backoff HTTP client, used by both API clients
├── shipbob.go          ShipBob client
├── gorgias.go           Gorgias client, customer key, payload builders
├── cron.go               Flow A — resumable order sync
├── webhook.go              Flow B — shipment status webhook -> ticket, with dedupe
├── main.go                 entry point; dispatches on run mode
├── fakes_test.go            test doubles (compiled only under `go test`)
└── *_test.go                one test file per source file, in the same package
```

`lib.go` is the file to read first — the whole platform contract in one file: `PAN_CFG_*`/
`PAN_SEC_*` as plain maps, `PAN_CTX_*` as named methods, the metadata file read, and the
single stdout write that hands metadata back to Pandium.

Tests live beside the code as `foo_test.go`, in the same package — Go's own convention,
not a separate `test/` directory. `go test`'s `_test.go` suffix keeps test-only code out of
the built binary automatically, with no attribute needed.

## Go implementation details

**The run-limit deadline** is `time.AfterFunc`, not a signal handler. A `context.WithTimeout`
was considered and rejected: cancelling a context makes the *next* HTTP call return an
error, which looks like a failure — but the actual desired behavior on timeout is "stop
cleanly, flush the cursor, and succeed." `time.AfterFunc` schedules a callback on its own
goroutine without touching anything in flight, which is the right shape for "succeed early"
rather than "fail early":

```go
func defaultArmWatchdog(deadline time.Duration, onTimeout func()) (cancel func()) {
    timer := time.AfterFunc(deadline, onTimeout)
    return func() { timer.Stop() }
}
```

Because the watchdog callback runs on a separate goroutine from the paging loop, the cursor
values it might flush are held behind a `sync.Mutex` (`cursorState` in `cron.go`) rather
than as plain variables.

**No monkey-patching, so the client interfaces exist from the start.** Go can't reassign a
struct's methods at runtime the way Python or JavaScript test doubles do. `cron.go` and
`webhook.go` depend on the `ShipBobClient`/`GorgiasClient` interfaces, never the concrete
`*ShipBobAPI`/`*GorgiasAPI` types, so `fakes_test.go`'s `FakeShipBob`/`RecordingGorgias` can
satisfy them too.

**Mode dispatch** is a `switch` on `PAN_CTX_RUN_MODE` in `main.go`:

```go
switch mode {
case "webhook":
    return webhookRun(pandium)
default:
    return cronRun(pandium)
}
```

**JWT issuer decoding needs no library.** `shipbob.go`'s `resolveBaseURL` decodes the token
payload with the standard library's `encoding/base64` and `encoding/json` directly.

**The two cursors resume differently**, and the code shape reflects it. `new_order_start_date`
climbs per order over an oldest-first query, so it's sound to flush at any point. Pages for
`updated_order_start_date` are sorted newest-first individually but not relative to each
other, so the true minimum isn't known until every page has been read — it's tracked in a
local, unshared variable through the whole loop and copied into the shared cursor state only
once, after the loop fully exhausts. A run cut short — by the watchdog or by a fetch error —
leaves it exactly where it started rather than committing a partial answer that might sit
newer than an order on a page that was never read.

**A fetch failure and an exhausted query must stay distinguishable.** The paging loop treats
an empty page as "no more results," so `shipbob.go`'s `getOrders` returns an error on a
failed request or a malformed response — only a genuinely empty or `null` body returns `nil`.
An error propagates out of the whole run: `main.go` never calls `UpdateMetadata` when `run`
returns an error, so nothing reaches stdout and the tenant's stored metadata is left exactly
as the last successful run wrote it.

## Prerequisites

- Go 1.26

## Build

```bash
cd go
go build -o sb2gorgias .
```

## Running the tests

15 tests covering both flows end to end — including the timeout flush, a fetch failure, and
the webhook dedupe — with no network access and no credentials:

```bash
go test ./...
```

`fakes_test.go` implements the same `ShipBobClient`/`GorgiasClient` interfaces the real
clients do, so the flows under test run their real logic — only the API calls at the edges
are swapped for in-memory recorders. The `_test.go` suffix keeps it out of the built binary
with no build tag needed.

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
pandium local build                       # runs the manifest's build command (go build)
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
`go/.env`:

```properties
PAN_SEC_SHIPBOB_ACCESS_TOKEN=eyJ...
PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN=...
PAN_SEC_GORGIAS_OAUTH_ACCOUNT=your-store

PAN_CFG_ORDER_START_DATE=2026-07-01
PAN_CFG_NEWEST_ORDER_FIRST=false

PAN_CTX_RUN_MODE=normal
PAN_CTX_TENANT_METADATA_FILE=./metadata.json
```

Seed the metadata file, build, then run the cron flow:

```bash
echo '{}' > metadata.json
go build -o sb2gorgias . && ./sb2gorgias
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.

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
its own by flipping `PAN_CTX_RUN_MODE` to `webhook` in `.env` and rebuilding/running.

> Keep `.env` out of version control — it is already in `go/.gitignore`.

## Go-specific notes

- `maxOrdersToSync` in `cron.go` caps how many orders are retained per customer (10).
- `Clamp` in `cron.go` is what enforces the 30-day floor the connection-settings form
  promises; the manifest does not constrain the date itself.
- `parseTimestamp` in `lib.go` normalizes every timestamp to UTC, so cursor comparisons
  never have to think about offsets — the two APIs and the settings form send an RFC 3339
  offset, the same without one, and a bare `2026-07-01`.
- `http.go`'s retry client retries 429, 502, 503, and 504 with a doubling backoff. Pandium
  does not retry a failed run on its own, so a transient rate limit has to be absorbed there
  or the whole run is lost.
- Orders and events are handled as `map[string]any` (decoded JSON), not typed structs — they
  are mostly passed straight through to the Gorgias sidebar unread, so `deepGet` in `lib.go`
  does the same dotted-path lookup Python's `deep_get` does, rather than modelling every
  ShipBob field.
