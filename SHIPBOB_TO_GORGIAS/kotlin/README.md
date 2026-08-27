# ShipBob to Gorgias in Kotlin

The Kotlin implementation of the [ShipBob to Gorgias sample](../README.md). Read that first
for what the integration does and which parts of the Pandium platform it exercises; this
page covers the code, and how to build, run, and test it.


## Layout

```
kotlin/
├── PANDIUM.yaml                     manifest: runtime, configs, metadata schema
├── settings.gradle.kts              the Gradle build
└── app/
    ├── build.gradle.kts             dependencies and the fat-jar task
    └── src/
        ├── main/kotlin/sb2gorgias/
        │   ├── Main.kt              entry point; dispatches on run mode
        │   ├── Pandium.kt           the Pandium runtime contract: config, secrets, context, metadata
        │   ├── Cron.kt              Flow A — resumable order sync
        │   ├── Webhook.kt           Flow B — shipment status webhook → ticket, with dedupe
        │   ├── ShipBob.kt           ShipBob client, and the ShipBob shapes we read
        │   ├── Gorgias.kt           Gorgias client, customer key, payload builders
        │   ├── Http.kt              bearer auth and retry, shared by both clients
        │   ├── Dates.kt             timestamp parsing and formatting
        │   └── Json.kt              the shared codec, and accessors for JSON we do not model
        ├── main/resources/
        │   └── logback.xml          logging — to stderr, because stdout is Pandium's
        └── test/kotlin/sb2gorgias/
            ├── Fakes.kt             test doubles and payload factories
            ├── CronTest.kt          Flow A
            └── WebhookTest.kt       Flow B
```

`Pandium.kt` is the file to read first. It is the whole platform contract in a single
file: `PAN_CFG_*` and `PAN_SEC_*` as plain maps, `PAN_CTX_*` as named properties, the
metadata file read, and the single stdout write that hands metadata back to Pandium.

## Kotlin implementation details

**The run-limit deadline** is a daemon thread. The sync loop and the watchdog share one 
`AtomicReference<Cursors>`. When the watchdog reaches the timeout limit it writes 
whatever the loop had reached (`Cron.kt`):

```kotlin
private fun flushAtDeadline(cursors: AtomicReference<Cursors>, deadline: Duration) {
    thread(isDaemon = true, name = "deadline-flush") {
        Thread.sleep(deadline.inWholeMilliseconds)
        logger.warn { "approaching the run-time limit — flushing the cursor for the next run" }
        // The same writer the normal path uses, so there is exactly one route to stdout,
        // and exit 0 so Pandium counts the run as a success and merges the partial cursor.
        updateMetadata(cursors.get().asMetadata())
        exitProcess(0)
    }
}
```

`Cursors` is an immutable data class in an `AtomicReference`, not a mutable object behind
a lock, so the watchdog always reads a whole, consistent pair. There is nothing to cancel
on the way out: `isDaemon = true` means the thread does not hold the JVM open, which is
this design's answer to Python's `signal.alarm(0)`.

A `withTimeout` coroutine would be the more fashionable choice and the wrong one here.
Cancellation in structured concurrency is cooperative, and this run is blocking HTTP from
end to end — the timeout would not fire until the sync next suspended, which it never
does.

**Mode dispatch** is a `when` on `PAN_CTX_RUN_MODE` in `Main.kt`:

```kotlin
val metadata = when (mode) {
    "webhook" -> runWebhookFlow(pandium)   // Flow B — shipment status → ticket
    else -> runCronFlow(pandium)           // Flow A — scheduled order sync
}
```

**Paging is a lazy `Sequence`.** Both halves of the sync page until an empty page comes
back, which `Cron.kt` expresses once:

```kotlin
private fun ordersUntilExhausted(fetch: (Int) -> List<JsonElement>): Sequence<JsonElement> =
    generateSequence(1) { it + 1 }
        .map(fetch)
        .takeWhile { page -> page.isNotEmpty() }
        .flatten()
```

Laziness is load-bearing, not decoration: a page is fetched only once the previous one has
been processed and the cursor has moved with it, which is what keeps a mid-run flush
honest about how far the sync actually got. Eager `map` would fetch the whole backlog
before the first order was written.

**Two styles of deserialization**, chosen by what each flow does with the data:

- A **webhook body** is small, fully specified, and every field drives a decision, so it
  gets real types (`Shipment` and friends in `ShipBob.kt`). Modelling `tracking` as a
  nullable `Tracking` is what makes "only mention tracking when ShipBob sent some" a
  `?.let` the compiler can see, rather than a runtime lookup that might be `null`,
  absent, or the wrong shape.
- An **order** is mostly *passed through* to the Gorgias sidebar unread, so it stays a raw
  `JsonElement` and only the parts the integration acts on are pulled out.
  `decodeFromJsonElement` reads a typed field straight out of untyped JSON, so `Recipient`
  costs nothing but the strings it copies:

  ```kotlin
  fun of(order: JsonElement?): Recipient =
      order["recipient"]?.let { runCatching { json.decodeFromJsonElement<Recipient>(it) }.getOrNull() }
          ?: Recipient()
  ```

**Reading untyped JSON uses nullable receivers.** The handful of accessors in `Json.kt`
all extend `JsonElement?`, not `JsonElement`:

```kotlin
operator fun JsonElement?.get(key: String): JsonElement? = (this as? JsonObject)?.get(key)
val JsonElement?.string: String? get() = (this as? JsonPrimitive)?.takeIf { it.isString }?.content
```

which is what lets `order["recipient"]["address"]["city"].string` read straight through
with no `?.` and no intermediate checks. A missing key, a JSON `null`, and a value of the
wrong shape all answer `null`, so there is one thing to handle instead of three.

**One codec, configured once.** Three settings in `Json.kt` do the work that would
otherwise be per-field annotations:

```kotlin
val json: Json = Json {
    ignoreUnknownKeys = true                          // both APIs send more than we read
    coerceInputValues = true                          // "tracking": null and no key at all are the same thing
    namingStrategy = JsonNamingStrategy.SnakeCase     // the APIs are snake_case; the data classes are not
}
```

ShipBob uses a missing key and an explicit `null` interchangeably — an `OnHold` shipment
sends `"tracking": null` where another topic omits the key. `coerceInputValues` turns both
into the property's declared default, so `statusDetails: List<StatusDetail> = emptyList()`
holds either way.

**The customer key is a sealed interface.** A ShipBob recipient often has no usable email,
so both flows fall back to a synthetic key built from the recipient's name and address.
Making that `CustomerKey.Email | CustomerKey.ExternalId` rather than a pair of optional
arguments means there is always exactly one key, the `when` that turns it into a query
parameter is exhaustive without an `else`, and the lookup and the created record cannot
disagree about it.

**Both flows split in two.** `runCronFlow` / `runWebhookFlow` read the environment and
build the API clients; `sync` and `process` take the `Orders` and `Helpdesk` interfaces
and hold the actual logic. The tests drive the second half with in-memory doubles, so the
flow's real logic runs without a network, a token, or an environment variable.

**Failures are exceptions, not a result type.** Kotlin has `Result`, and this is one of
the places not to reach for it: an exception thrown by the ShipBob client travels out of
the paging sequence and out of `sync` on its own, which is exactly the behaviour the
design needs. `main` catches it, logs it, and exits non-zero having written nothing to
stdout — leaving the tenant's stored metadata as the last successful run left it.

## Prerequisites

- A JDK. Gradle provisions the JDK 25 toolchain the build asks for, so any recent JDK will
  do to launch it.
- Gradle 9 (or use your own wrapper).

## Build

```bash
cd kotlin
gradle fatJar
```

That produces `app/build/libs/app-all.jar`, which is what `PANDIUM.yaml` runs.

## Running the tests

Six tests, one per behaviour worth understanding before you copy this sample. They run
both flows end to end with no network access and no credentials:

```bash
gradle test
```

```
sb2gorgias.CronTest
  the sync pages until empty and keeps the cursor current as it goes  PASSED
  the updated cursor lands on the oldest update across every page     PASSED
  a page that fails to fetch ends the run rather than committing a cursor  PASSED
sb2gorgias.WebhookTest
  a delivery opens a ticket and writes only processed events          PASSED
  a repeated status is dropped but the next status still tickets      PASSED
  a recipient with no email gets a customer keyed on their address    PASSED
```

`Fakes.kt` implements the same `Orders` and `Helpdesk` interfaces the real clients do, so
the flows under test run their real logic.

## Running it locally

Both flows talk to the live ShipBob and Gorgias APIs, so always use sandbox credentials 
for testing and development.

### With the Pandium CLI

The CLI runs the integration in the current folder using the environment of a real tenant. 
Download it from the Pandium Integration Hub under **Settings → Developer Resources**.

```bash
pandium login                            # defaults to sandbox
pandium get integrations                 # find your integration id
pandium get tenants -i <integration_id>  # find the tenant id to borrow
```

Then, from this directory:

```bash
pandium local build                       # runs the build command from the Pandium file (gradle fatJar)
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how
you change one config without touching the tenant, and how you hand the CLI a webhook
payload to run against.

### With a `.env` file

`Pandium.fromEnv()` loads a `.env` from the working directory when there is one, which is
the same mechanism Pandium uses in production — environment variables, nothing else.
Create `kotlin/.env`:

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
gradle run
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.

Set `LOG_LEVEL=debug` for more, or `LOG_LEVEL=warn` for less — `logback.xml` reads it, and
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
its own by flipping `PAN_CTX_RUN_MODE` to `webhook` in `.env` and running `gradle run` again.

> Keep `.env` out of version control — it is already in `kotlin/.gitignore`.

## Kotlin-specific notes

- `MAX_ORDERS_TO_SYNC` in `Cron.kt` caps how many orders are retained per customer (10).
- `clamp()` in `Cron.kt` is what enforces the 30-day floor the connection-settings form
  promises; the manifest does not constrain the date itself. It is a one-liner because
  `LocalDateTime` is `Comparable`, so `coerceIn` does the work.
- `parseTimestamp` in `Dates.kt` normalises every timestamp to UTC-without-an-offset
  (`LocalDateTime`), so cursor comparisons never have to think about offsets. Between them
  the two APIs and the settings form send RFC 3339 with an offset, the same without one,
  and a bare `2026-07-01`; one `DateTimeFormatter` with optional sections plus `parseBest`
  covers all three.
- `ApiClient` in `Http.kt` retries 429, 502, 503, and 504. Pandium does not retry a failed
  run on its own, so a transient rate limit has to be absorbed there or the whole run is
  lost. A response carrying `Retry-After` sets the wait — the doubling backoff is only the
  fallback for one that does not — clamped to `MAX_RETRY_AFTER`, because a client that
  sleeps past Pandium's run limit never reaches the stdout write that ends the run
  successfully.
- `CustomerRecord` in `Cron.kt` rebuilds the customer payload rather than editing what
  Gorgias sent back. `JsonObject` is immutable, which turns out to be the right shape
  anyway: `data` keys the integration does not own are copied across untouched, and a
  hand-edited `{"pandium": null}` is a non-event rather than something to defend against
  level by level.
- **Nothing but metadata may reach stdout.** `logback.xml` targets `System.err`, and the
  manifest's run command passes `-Dkotlin-logging.logStartupMessage=false` because
  kotlin-logging otherwise announces itself on stdout as it initialises. On a failed run
  that banner would be the only thing there, and Pandium reads the last non-empty line of
  stdout as the tenant's metadata.
