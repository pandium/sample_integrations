# ShipBob to Gorgias

A Pandium sample integration that puts a customer's ShipBob order history on their
Gorgias profile, and opens a Gorgias ticket whenever one of their shipments changes
status.

## Implementations

The same integration, built the same way, in each language Pandium supports. Every
implementation declares the same connectors, configs, and metadata schema — only the
`base`, `build`, and `run` lines of its `PANDIUM.yaml` differ.

| Language | Notes |
| --- | --- |
| [Python](python/) | `pipenv`, `requests`, `pytest` |

More languages are on the way.

---

## What this sample demonstrates

### 1. Syncs that outlive the run limit

Pandium caps a run at roughly ten minutes. A tenant with a large order backlog will not
finish in one pass, so this sync is designed to restart where the previous sync left off.

The pattern is an in-memory cursor, which the integration code keeps current as each order
is processed, plus a handler that flushes it on either outcome:

- **Normal completion** — write the cursor, exit `0`.
- **Timeout** — a self-imposed deadline set a minute inside Pandium's limit fires, the
  handler writes the cursor as it stands, and the run exits `0`.

A run that self-terminates at nine minutes is still a *successful* run, so its cursor is
merged into tenant metadata; the next scheduled run reads that cursor and picks up where
this one stopped. A run that hits Pandium's hard limit instead is marked
**Failed (Timeout)** and writes nothing.

### 2. Webhook handling

Pandium provides webhook receiving endpoints for all connectors that send webhooks, with
programmatic subscription through the Integration Hub where possible. So there is no web
server in this repo and no endpoint to deploy: Pandium receives the ShipBob delivery,
writes the raw body to disk, and hands the run an array of triggers on
`PAN_CTX_RUN_TRIGGERS`:

```json
[
  {
    "id": "4731234254284123",
    "source": "webhook",
    "mode": "webhook",
    "payload": {
      "file": "/path/to/payload"
    }
  }
]
```

Two important details:

- Pandium **debounces per tenant**. Deliveries that arrive while a run is in flight are
  bundled into the next run's trigger array, so the code loops over **N** payloads per run,
  never exactly one.
- Because deliveries can repeat — ShipBob retries anything that doesn't get a 2xx, and
  debouncing can re-present a trigger — and because `POST /tickets` is not idempotent, the
  flow dedupes on `shipment_id:status` before it opens anything. Keying on the status as
  well as the shipment is what lets a redelivery be dropped while the shipment's *next*
  status still gets its own ticket.

### 3. Per-tenant state in tenant metadata

Tenant metadata is Pandium's mechanism for state an integration to persist state between runs. The
contract is two halves:

- **Read** — Pandium writes the tenant's current metadata to a JSON file and names it in
  `PAN_CTX_TENANT_METADATA_FILE`.
- **Write** — print JSON to **stdout** as the last thing the run does. Pandium validates it
  against `metadata_schema` in `PANDIUM.yaml` and shallow-merges it into the stored
  metadata. Validation failure fails the run with **Failed (Metadata Validation)** and
  leaves metadata untouched.

This sample keeps three keys there:

```json
{
  "new_order_start_date": "2026-07-01T00:00:00",
  "updated_order_start_date": "2026-07-01T00:00:00",
  "processed_events": { "456789:Delivered": "2026-07-09T18:22:10Z" }
}
```

Logs go to **stderr** so they never contaminate the stdout channel.

### 4. One script, more than one trigger type

Both flows ship in a single deployable and are selected by `PAN_CTX_RUN_MODE`. Scheduled
and manual runs take the cron path; `webhook` takes the webhook path. There is no separate
service, no second deploy target, and no routing layer — one entry point reads the mode and
branches.

---

## The two flows

**CRON: ShipBob orders → Gorgias customer.** Pages `GET /order` twice, once for
orders created since the cursor and once for orders updated since it, and upserts each
order's customer in Gorgias, writing order history to `data.pandium.shipbob_orders` on the
customer record. Customers are keyed by a valid recipient email when there is one and by a
synthetic `name address1 city country` string otherwise. Orders for the same customer batch
onto one record within a run, and each customer keeps its ten most recent orders.

ShipBob puts `last_update_at` on shipments rather than orders, so the "updated" cursor is
derived from the oldest shipment timestamp that still falls after the cursor — deliberately
conservative, since re-processing an order is harmless (customer writes are idempotent PUTs)
but skipping one is not.

**WEBHOOK: ShipBob order webhook → Gorgias ticket.** ShipBob's order-related topics —
`order_shipped`, `shipment_delivered`, `shipment_exception`, `shipment_onhold`,
`shipment_cancelled` — all deliver the same shipment object and differ only in `status`
and `status_details`. The flow opens a ticket for every one of them, so a shipment that
goes `OnHold` on an invalid address reaches support at the point it needs a human, not
only once it lands.

For each trigger: parse the body, skip any `shipment_id:status` already in the pruned
`processed_events` map, find-or-create the customer, and `POST /tickets`. The ticket
carries the status, ShipBob's `status_details` reasons, the items, and tracking when the
status has any, and is tagged `shipbob-shipment` plus `shipbob-<status>` so Gorgias rules
can route on it. A ticket that fails to create is deliberately *not* marked processed, so
ShipBob's retry gets another chance.

Customers are resolved the same way the cron flow resolves them — by valid recipient email
when there is one, by the synthetic `name address1 city country` external_id otherwise — so
the ticket lands on the same record that carries the order history. Recipient email is
optional on a ShipBob shipment, so both paths matter here.

---

## Anatomy

`PANDIUM.yaml` is the manifest — it declares the runtime, the connectors whose secrets get
injected, the configuration form your users fill in, and the metadata schema. Only three 
lines change between language implementations:

```yaml
version: 1.0
base: python:3.14      # also: node, ruby, java, php, .net, go, kotlin, rust
build: pipenv install
run: pipenv run python -m sb2gorgias

connectors:
  - shipbob
  - gorgias-oauth
```

The information the integration needs to do its job arrives as environment variables.
`PAN_CFG_*` and `PAN_SEC_*` hold per-integration keys and are best read as plain maps;
`PAN_CTX_*` is controlled by Pandium, and each implementation surfaces it through named,
typed accessors rather than raw environment lookups.

| Variable | Source | Used for |
| --- | --- | --- |
| `PAN_SEC_SHIPBOB_ACCESS_TOKEN` | `shipbob` connector | Bearer auth. The API base URL is decoded from the token's `iss` claim, so the same code targets prod, sandbox, or QA depending on which token the tenant connected. |
| `PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN` | `gorgias-oauth` connector | Bearer auth against the Gorgias API |
| `PAN_SEC_GORGIAS_OAUTH_ACCOUNT` | `gorgias-oauth` connector | Store subdomain; resolves `https://<account>.gorgias.com/api` |
| `PAN_CFG_ORDER_START_DATE` | connection settings | How far back the first sync reaches; clamped to the last 30 days |
| `PAN_CFG_NEWEST_ORDER_FIRST` | connection settings | Sort direction of the sidebar order list |
| `PAN_CTX_RUN_MODE` | Pandium | `init`, `normal`, or `webhook` |
| `PAN_CTX_RUN_TRIGGERS` | Pandium | JSON array of what caused this run |
| `PAN_CTX_TENANT_METADATA_FILE` | Pandium | Path to this tenant's stored metadata |

Both connectors are OAuth2, and no implementation here contains a line of OAuth code.
Pandium runs the authorization flow when a tenant connects and refreshes the tokens as needed, 
so a run reads whichever access token is current and injects it into the run environment.

---


## Further reading

- [Environment variables](https://docs.pandium.com/getting-started/anatomy-of-an-integration/environment-variables)
- [Context: stdout](https://docs.pandium.com/getting-started/anatomy-of-an-integration/environment-variables/stdout)
- [Run triggers](https://docs.pandium.com/getting-started/anatomy-of-an-integration/run-triggers)
- [Tenant metadata](https://docs.pandium.com/getting-started/anatomy-of-an-integration/pandium.yaml-spec/tenant-metadata)
- [Run failures](https://docs.pandium.com/getting-started/anatomy-of-an-integration/run-failures)
