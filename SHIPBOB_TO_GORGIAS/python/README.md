# ShipBob to Gorgias in Python

The Python implementation of the [ShipBob to Gorgias sample](../README.md). Read that first
for what the integration does and which parts of the Pandium platform it exercises; this
page covers the code, and how to install, run, and test it.

Python 3.14, `pipenv`, `requests`. No framework, no web server.

## Layout

```
python/
├── PANDIUM.yaml            manifest: runtime, connectors, configs, metadata schema
├── Pipfile                 dependencies (requests, coloredlogs)
├── sb2gorgias/
│   ├── __main__.py         entry point; dispatches on run mode
│   ├── lib.py              the Pandium runtime contract: config, secrets, context, metadata
│   ├── cron.py             Flow A — resumable order sync
│   ├── webhook.py          Flow B — delivered shipment → ticket, with dedupe
│   ├── shipbob.py          ShipBob client
│   └── gorgias.py          Gorgias client
└── tests/                  both flows covered end to end; no network
```

`lib.py` is the file to read first. It is the whole platform contract in a single 
file: `PAN_CFG_*` and `PAN_SEC_*` as plain maps, `PAN_CTX_*` as named properties, the
metadata file read, and the single stdout write that hands metadata back to Pandium.

## Python Implementation Details

**The run-limit deadline** is a `SIGALRM` armed for 540 seconds, a minute inside Pandium's
limit (`sb2gorgias/cron.py`):

```python
def on_alarm(signum, frame):
    logger.warning('Approaching the run-time limit — flushing cursor for the next run.')
    # Same writer the normal path uses, so there is exactly one route to stdout.
    pandium.update_metadata(record)
    sys.exit(0)  # timed-out run still counts as successful → partial cursor merged

signal.signal(signal.SIGALRM, on_alarm)
signal.alarm(ALARM_SECONDS)
```

Both outcomes write through `Pandium.update_metadata`.

**Mode dispatch** is a `match` on `PAN_CTX_RUN_MODE` in `sb2gorgias/__main__.py`:

```python
match mode:
    case 'webhook':
        return webhook.run(pandium)   # Flow B — delivered shipment → ticket
    case _:
        return cron.run(pandium)      # Flow A — scheduled order sync
```

**Webhook payloads** arrive as file paths, not inline JSON, so `Pandium.webhook_deliveries()`
reads each body back off disk. The flow in `webhook.py` never touches the filesystem — it
just handles events. Pandium verifies delivery signatures before the run starts, so there is
nothing to authenticate here either.

## Prerequisites

- Python 3.14
- [pipenv](https://pipenv.pypa.io/): `pip install pipenv`

## Install

```bash
cd python
pipenv install --dev
```

## Running the tests

The tests cover both flows end to end — including the timeout flush and the webhook
dedupe — with no network access and no credentials:

```bash
pipenv run pytest
```

```
.........                                                                [100%]
9 passed in 0.09s
```

`tests/helpers.py` builds a real `Pandium` object from a dict instead of the environment and
swaps the HTTP methods on a real client for in-memory recorders, so client logic still runs
under test.

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
pandium local build                       # runs the manifest's build command (pipenv install)
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how
you change one config without touching the tenant, and how you hand the CLI a webhook
payload to run against.

### With a `.env` file

`pipenv run` auto-loads a `.env` from the project directory, which is the same mechanism
Pandium uses in production — environment variables, nothing else. Create `python/.env`:

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
pipenv run python -m sb2gorgias
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.

### Exercising the webhook flow

Neither route can invent a delivery, so both read the run triggers from `.env` — an array
whose `payload.file` points at a body on disk, exactly as Pandium would supply it. Generate
one with the same helper the tests use:

```bash
mkdir -p /tmp/wh
PYTHONPATH=.:tests pipenv run python -c "
from pathlib import Path; import json
from helpers import make_delivered_event, webhook_trigger
print(json.dumps([webhook_trigger(Path('/tmp/wh'), make_delivered_event(), 't1')]))
"
```

Add the printed array to `.env` as `PAN_CTX_RUN_TRIGGERS`. Then run it either way — via the
CLI with `pandium local run <tenant_id> -m webhook`, or on its own by flipping
`PAN_CTX_RUN_MODE` to `webhook` in `.env` and running the module again.

> Keep `.env` out of version control — it is already in `python/.gitignore`.

## Python-specific notes

- `MAX_ORDERS_TO_SYNC` in `cron.py` caps how many orders are retained per customer (10).
- `clamp()` in `cron.py` is what enforces the 30-day floor the connection-settings form
  promises; the manifest does not constrain the date itself.
- `deep_get(data, 'a.b.c')` in `lib.py` is used for every read of an API response. Both
  APIs return deeply nested JSON in which almost every level is optional.
