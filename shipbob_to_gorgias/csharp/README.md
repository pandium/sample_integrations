# ShipBob to Gorgias in C#

The C# implementation of the [ShipBob to Gorgias sample](../README.md). Read that first
for what the integration does and which parts of the Pandium platform it exercises; this
page covers the code, and how to build, run, and test it.


## Layout

```
csharp/
├── PANDIUM.yaml                     manifest: runtime, configs, metadata schema
├── global.json                      opts `dotnet test` into Microsoft.Testing.Platform, which xUnit v3 runs on
├── sb2gorgias.sln
├── sb2gorgias/
│   ├── Program.cs                   entry point; dispatches on run mode, owns the deadline
│   ├── Pandium.cs                   the Pandium runtime contract: config, secrets, context, metadata
│   ├── Cron.cs                      Flow A — resumable order sync
│   ├── Webhook.cs                   Flow B — shipment status webhook → ticket, with dedupe
│   ├── ShipBob.cs                   ShipBob client, and the ShipBob shapes we read
│   ├── Gorgias.cs                   Gorgias client, customer key, payload builders
│   ├── ApiClient.cs                 bearer auth and retry, shared by both clients
│   ├── Dates.cs                     timestamp parsing and formatting
│   └── Json.cs                      the shared options, and accessors for JSON we do not model
└── sb2gorgias.Tests/
    ├── Fakes.cs                     test doubles and payload factories
    ├── CronTests.cs                 Flow A
    └── WebhookTests.cs              Flow B
```

`Pandium.cs` is the file to read first. It is the whole platform contract in a single
file: `PAN_CFG_*` and `PAN_SEC_*` as plain dictionaries, `PAN_CTX_*` as named members, the
metadata file read, and the single stdout write that hands metadata back to Pandium.

## C# implementation details

**The run-limit deadline is a `CancellationToken`.** `Program.cs` starts the clock, and
both flows take the token:

```csharp
private static readonly TimeSpan Deadline = TimeSpan.FromMinutes(9);
...
using var deadline = new CancellationTokenSource(Deadline);
```

The sync checks it as it hands over each order, and `SyncAsync` treats the cancellation as
an outcome rather than an error (`Cron.cs`):

```csharp
catch (OperationCanceledException)
{
    logger.LogWarning("approaching the run-time limit — flushing the cursor for the next run");
}
```

Returning normally is the point: `Program.Main` writes the cursor as it stands and exits
`0`, so Pandium counts the run as a success and merges the partial cursor. Because the
same token reaches `HttpClient.SendAsync`, a request still in flight at the deadline is
torn down rather than waited on.

This is the one place the C# version differs structurally from the other implementations,
which flush from a watchdog thread or a signal handler. Cooperative cancellation is the
idiom here, and it costs nothing: there is one thread, so the cursor is an ordinary
mutable object rather than something shared under a lock, and the deadline behaviour is
testable — `TheRunDeadlineEndsTheSyncWithTheCursorItHadReached` cancels between two pages
and asserts on what the run would have written.

**Paging is an async iterator.** Both halves of the sync page until an empty page comes
back, which `Cron.cs` expresses once:

```csharp
private static async IAsyncEnumerable<JsonNode?> OrdersUntilExhaustedAsync(
    Func<int, Task<IReadOnlyList<JsonNode?>>> fetchPage,
    [EnumeratorCancellation] CancellationToken token)
{
    for (var page = 1; ; page++)
    {
        var orders = await fetchPage(page);
        if (orders.Count == 0)
        {
            yield break;
        }

        foreach (var order in orders)
        {
            token.ThrowIfCancellationRequested();
            yield return order;
        }
    }
}
```

Laziness is load-bearing, not decoration: a page is fetched only once the previous one has
been processed and the cursor has moved with it, which is what keeps a mid-run flush
honest about how far the sync actually got. Building the whole backlog into a list first
would fetch every page before the first order was written.

**Two styles of deserialization**, chosen by what each flow does with the data:

- A **webhook body** is small, fully specified, and every field drives a decision, so it
  gets real types (`Shipment` and friends in `ShipBob.cs`). Modelling `Tracking` as a
  nullable record is what makes "only mention tracking when ShipBob sent some" an
  `is { } tracking` the compiler can see, rather than a runtime lookup that might be
  `null`, absent, or the wrong shape.
- An **order** is mostly *passed through* to the Gorgias sidebar unread, so it stays a raw
  `JsonNode` and only the parts the integration acts on are pulled out. `Deserialize<T>`
  reads a typed field straight out of untyped JSON, so `Recipient` costs nothing but the
  strings it copies:

  ```csharp
  public static Recipient? RecipientOf(this JsonNode? order)
  {
      try
      {
          return order.Field("recipient")?.Deserialize<Recipient>(Json.Options);
      }
      catch (JsonException)
      {
          return null;
      }
  }
  ```

**Reading untyped JSON goes through extensions on `JsonNode?`.** The handful of accessors
in `Json.cs` all take a *nullable* receiver:

```csharp
public static JsonNode? Field(this JsonNode? node, string key) =>
    node is JsonObject item && item.TryGetPropertyValue(key, out var value) ? value : null;

public static string? AsText(this JsonNode? node) =>
    node is JsonValue value && value.TryGetValue<string>(out var text) ? text : null;
```

which is what lets `order.Field("recipient").Field("address").Field("city").AsText()` read
straight through with no null checks in between. A missing key, a JSON `null`, and a value
of the wrong shape all answer `null`, so there is one thing to handle instead of three —
where `JsonNode`'s own indexer would throw on the last two.

**One set of options, configured once.** Two settings in `Json.cs` do the work that would
otherwise be a `[JsonPropertyName]` on every property:

```csharp
public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
{
    PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
};
```

`JsonSerializerDefaults.Web` skips unknown properties and matches names case-insensitively
— both APIs send far more than this integration reads, and add fields over time — and the
naming policy maps `status_details` onto `StatusDetails` for every record in `ShipBob.cs`.
`Address1` is the one property that still names itself, since the policy does not put a
trailing digit in its own word.

**`JsonNode` has a parent, so anything re-parented is cloned.** A node belongs to exactly
one document, and assigning one that already has a parent throws. `CustomerRecord.Payload()`
in `Cron.cs` is called once per order, so it deep-clones everything it copies across:

```csharp
pandium["shipbob_orders"] = new JsonArray([.. _orders.Select(order => order?.DeepClone())]);
```

That turns out to be the right shape anyway: `data` keys the integration does not own are
copied across untouched, and a hand-edited `{"pandium": null}` is a non-event rather than
something to defend against level by level.

**The customer key is a closed record hierarchy.** A ShipBob recipient often has no email,
so both flows fall back to a synthetic key built from the recipient's name and address.
Making that `CustomerKey.Email | CustomerKey.ExternalId` — an abstract record with a
private constructor, so the two nested cases are the only ones there can be — rather than
a pair of optional arguments means there is always exactly one key, each case answers for
its own query parameter, and the lookup and the created record cannot disagree about it.

**Both flows split in two.** The static `RunAsync` reads the environment and builds the
API clients; the `CronFlow` / `WebhookFlow` instances take the `IOrders` and `IHelpdesk`
interfaces through their constructors and hold the actual logic. The tests construct them
with in-memory doubles and a `NullLogger`, so the flow's real logic runs without a network,
a token, or an environment variable.

**Failures are exceptions, not a result type.** An exception thrown by the ShipBob client
travels out of the async iterator and out of `SyncAsync` on its own, which is exactly the
behaviour the design needs. `Main` catches it, logs it, and returns a non-zero exit code
having written nothing to stdout — leaving the tenant's stored metadata as the last
successful run left it. The `when (error is not OperationCanceledException)` filters on the
inner `catch`es are what keep the deadline from being swallowed by a handler meant for a
failed API call.

## Prerequisites

- The .NET 10 SDK.

## Build

```bash
cd csharp
dotnet publish sb2gorgias -o publish
```

That produces `publish/sb2gorgias.dll`, which is what `PANDIUM.yaml` runs.

## Running the tests

Seven tests, one per behaviour worth understanding before you copy this sample. They run
both flows end to end with no network access and no credentials:

```bash
dotnet test
```

```
Test run summary: Passed!
  total: 7
  failed: 0
  succeeded: 7
  skipped: 0
```

- **`CronTests`** — the sync pages until empty and keeps the cursor current as it goes; the
  updated cursor lands on the oldest update across every page; a page that fails to fetch
  ends the run rather than committing a cursor; the run deadline ends the sync with the
  cursor it had reached.
- **`WebhookTests`** — a delivery opens a ticket and writes only processed events; a
  repeated status is dropped but the next status still tickets; a recipient with no email
  gets a customer keyed on their address.

`Fakes.cs` implements the same `IOrders` and `IHelpdesk` interfaces the real clients do, so
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
pandium local build                       # runs the build command from the Pandium file
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how
you change one config without touching the tenant, and how you hand the CLI a webhook
payload to run against.

### With a `.env` file

`Program.Main` loads a `.env` from the working directory when there is one, which is the
same mechanism Pandium uses in production — environment variables, nothing else. Real
environment variables win, so a stray `.env` cannot override a live run. Create
`csharp/.env`:

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
dotnet run --project sb2gorgias
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.

Set `LOG_LEVEL=debug` for more, or `LOG_LEVEL=warning` for less — `Program.cs` reads it,
and the default is `information`.

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
its own by flipping `PAN_CTX_RUN_MODE` to `webhook` in `.env` and running
`dotnet run --project sb2gorgias` again.

> Keep `.env` out of version control — it is already in `csharp/.gitignore`.

## C#-specific notes

- `MaxOrdersToSync` in `Cron.cs` caps how many orders are retained per customer (10).
- `Clamp()` in `Cron.cs` is what enforces the 30-day floor the connection-settings form
  promises; the manifest does not constrain the date itself.
- `ParseTimestamp` in `Dates.cs` normalises every timestamp to UTC, so cursor comparisons
  never have to think about offsets. Between them the two APIs and the settings form send
  RFC 3339 with an offset, the same without one, and a bare `2026-07-01`;
  `DateTimeStyles.AdjustToUniversal | AssumeUniversal` covers all three in one
  `DateTime.TryParse`.
- `ApiClient` in `ApiClient.cs` retries 429, 502, 503, and 504. Pandium does not retry a
  failed run on its own, so a transient rate limit has to be absorbed there or the whole
  run is lost. A response carrying `Retry-After` sets the wait — the doubling backoff is
  only the fallback for one that does not — clamped to `MaxRetryAfter`, because a client
  that sleeps past Pandium's run limit never reaches the stdout write that ends the run
  successfully. `HttpResponseHeaders.RetryAfter` has already told the header's two legal
  shapes apart, so there is nothing to parse.
- `ApiClient.SendAsync` takes a `Func<HttpRequestMessage>` rather than a request: a
  `HttpRequestMessage` cannot be sent twice, so a client that retries needs a fresh one per
  attempt.
- The `HttpClient.BaseAddress` in `ApiClient` is given a trailing slash and every path is
  relative without a leading one. That is the pair of conventions that keeps
  `https://api.shipbob.com/2026-01` + `order` from resolving to
  `https://api.shipbob.com/order`.
- **Nothing but metadata may reach stdout.** The console logger is configured with
  `LogToStandardErrorThreshold = LogLevel.Trace`, which sends every level to stderr.
  Pandium reads the last non-empty line of stdout as the tenant's metadata, so a stray
  `Console.WriteLine` would displace it.
