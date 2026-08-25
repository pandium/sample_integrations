# ShipBob to Gorgias in TypeScript

The TypeScript implementation of the [ShipBob to Gorgias sample](../README.md). Read that
first for what the integration does and which parts of the Pandium platform it exercises;
this page covers the code, and how to install, run, and test it.

Node.js 24, `axios`, `node:test`. No framework, no web server.

## Layout

```
typescript/
├── PANDIUM.yaml         manifest: runtime, connectors, configs, metadata schema
├── package.json         dependencies (axios, axios-retry, dotenv)
├── src/
│   ├── index.ts          entry point; dispatches on run mode
│   ├── lib.ts             the Pandium runtime contract: config, secrets, context, metadata
│   ├── cron.ts              Flow A — resumable order sync
│   ├── webhook.ts            Flow B — shipment status webhook -> ticket, with dedupe
│   ├── shipbob.ts             ShipBob client
│   └── gorgias.ts               Gorgias client
└── test/                 both flows covered end to end; no network
```

`lib.ts` is the file to read first — the whole platform contract in one file: `PAN_CFG_*`/
`PAN_SEC_*` as plain maps, `PAN_CTX_*` as named methods, the metadata file read, and the
single stdout write that hands metadata back to Pandium. It also configures the shared
`log4js` logger that every other file gets its own named instance from.

## Implementation notes

**The run-limit deadline** is a `setTimeout`-based watchdog in `cron.ts`, injectable via
`CronDeps` so tests can trigger it deterministically without waiting 9 real minutes.

**JWT issuer decoding** uses Node's `Buffer`, which natively supports `base64url` — no JWT
library needed. `shipbob.ts`'s `resolveBaseUrl` decodes the token payload directly.

**Date formatting for the customer sidebar** works on the raw ISO string with a regex
instead of parsing into a `Date` object, in `gorgias.ts` — JS `Date`'s local-time getters
silently convert to the server's local timezone, which would be a bug waiting to happen
against ShipBob's UTC-only timestamps.

## Prerequisites

- Node.js 24
- `npm`

## Install

```bash
cd typescript
npm install
```

## Running the tests

The tests cover both flows end to end — including the timeout flush and the webhook
dedupe — with no network access and no credentials:

```bash
npm test
```

`test/helpers.ts` builds a real `Pandium` object directly instead of from the environment
and swaps the HTTP methods on a real `GorgiasAPI` for in-memory recorders, so client helper
logic (customer key resolution, payload building) still runs under test.

## Running it locally

Both flows talk to the live ShipBob and Gorgias APIs, so use sandbox credentials either way.

### With the Pandium CLI

The CLI runs the integration in the current folder using the environment of a real tenant,
so the tenant's provisioned connector secrets are never copied onto your machine. Download
it from the Admin Dashboard under **Settings → Developer Resources**.

```bash
pandium login                          # defaults to sandbox
pandium get integrations               # find your integration id
pandium get tenants -i <integration_id>  # find the tenant id to borrow
```

Then, from this directory:

```bash
pandium local build                       # runs the manifest's build command (npm install)
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how
you change one config without touching the tenant, and how you hand the CLI a webhook
payload to run against.

### With a `.env` file

`dotenv` auto-loads a `.env` from the project directory, which is the same mechanism Pandium
uses in production — environment variables, nothing else. Create `typescript/.env`:

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
npm run build
node build/src/
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.

### Exercising the webhook flow

Neither route can invent a delivery, so both read the run triggers from `.env` — an array
whose `payload.file` points at a body on disk, exactly as Pandium would supply it. Generate
one with the same helpers the tests use:

```bash
mkdir -p /tmp/wh
node --import tsx -e "
import { makeShipmentEvent, webhookTrigger } from './test/helpers.ts'
console.log(JSON.stringify([webhookTrigger('/tmp/wh', makeShipmentEvent(), 't1')]))
"
```

`makeShipmentEvent(shipmentId, status)` takes any ShipBob status, and `makeOnholdEvent()`
next to it builds the harder shape — status details, no tracking, no recipient email — if
you want to exercise the external_id customer path.

Add the printed array to `.env` as `PAN_CTX_RUN_TRIGGERS`. Then run it either way — via the
CLI with `pandium local run <tenant_id> -m webhook`, or on its own by flipping
`PAN_CTX_RUN_MODE` to `webhook` in `.env` and running the build again.

> Keep `.env` out of version control — it is already in `typescript/.gitignore`.
