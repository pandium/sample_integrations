# ShipBob to Gorgias in PHP

The PHP implementation of the [ShipBob to Gorgias sample](../README.md). Read that first
for what the integration does and which parts of the Pandium platform it exercises; this
page covers the code, and how to install, run, and test it.

PHP 8.5, Composer, `guzzlehttp/guzzle`, PHPUnit. No framework, no web server.

## Layout

```
php/
├── PANDIUM.yaml            manifest: runtime, configs, metadata schema
├── composer.json           dependencies (guzzle, monolog, phpdotenv)
├── index.php               entry point; dispatches on run mode
├── src/
│   ├── Pandium.php         the Pandium runtime contract: config, secrets, context, metadata
│   ├── Log.php             the stderr logger every other file takes a named channel from
│   ├── Cron.php            Flow A — resumable order sync
│   ├── Webhook.php         Flow B — shipment status webhook → ticket, with dedupe
│   ├── ShipBobAPI.php      ShipBob client (behind ShipBobClient)
│   ├── GorgiasAPI.php      Gorgias client (behind GorgiasClient)
│   └── Http.php            the shared Guzzle setup: default headers and the retry policy
└── tests/                  both flows covered end to end; no network
```

`src/Pandium.php` is the file to read first. It is the whole platform contract in a single
file: `PAN_CFG_*` and `PAN_SEC_*` as plain arrays, `PAN_CTX_*` as named methods, the
metadata file read, and the single stdout write that hands metadata back to Pandium.

## PHP implementation details

**The run-limit deadline** is a `SIGALRM` armed for 540 seconds, a minute inside Pandium's
limit. The handler throws, rather than writing and exiting itself (`src/Cron.php`):

```php
pcntl_async_signals(true);
pcntl_signal(SIGALRM, static function (): never {
    throw new DeadlineReached('the run-time deadline passed');
});
pcntl_alarm(self::ALARM_SECONDS);
```

`run()` catches `DeadlineReached` around both sync loops and returns the record as it
stands, so a run that times out leaves through the same path as one that finishes: the
caller writes the record and the run exits `0`, which is what gets a partial cursor merged
into tenant metadata. The tests trip it by throwing the same exception from a canned page,
so no test waits nine minutes.

**Mode dispatch** is a `match` on `PAN_CTX_RUN_MODE` in `index.php`:

```php
$metadata = match ($pandium->runMode()) {
    'webhook' => Webhook::fromPandium($pandium)->run(),  // Flow B — shipment status → ticket
    default => Cron::fromPandium($pandium)->run(),       // Flow A — scheduled order sync
};
```

**Nested reads use `??`.** The other implementations in this repo carry a `deep_get` helper
for walking deeply nested, mostly-optional API responses; PHP's null-coalescing operator on
a nested subscript — `$event['recipient']['address']['city'] ?? ''` — already is that
helper, so there is no equivalent here.

**Boolean configs are read through `Pandium::configFlag()`.** Configs reach the run as
environment variables, so an unchecked box arrives as the string `'false'` — and every
non-empty string is truthy in PHP, `(bool) 'false'` included. Casting a `PAN_CFG_*` value
straight to `bool` is the mistake this helper exists to stop.

**Empty maps are cast to objects before they are written.** PHP encodes an empty array as
`[]`, and the manifest types `processed_events` as an object, so `Webhook::run` returns
`(object) $processed`. Writing `[]` there would fail metadata validation and take the run
with it.

**Date formatting for the customer sidebar** rearranges the digits of the raw ISO string
with a regex instead of parsing into a `DateTimeImmutable`, in `GorgiasAPI::formatDate` — a
`DateTime` formatter applies whatever timezone the run's PHP is configured for, which would
quietly shift ShipBob's UTC-only timestamps.

## Prerequisites

- PHP 8.5
- [Composer](https://getcomposer.org/)

## Install

```bash
cd php
composer install
```

## Running the tests

Eight tests, one per behaviour this sample is meant to show — the two cursors, the timeout
flush, the webhook dedupe — with no network access and no credentials:

```bash
composer test
```

```
PHPUnit 12.5.34 by Sebastian Bergmann and contributors.

........                                                            8 / 8 (100%)

OK (8 tests, 28 assertions)
```

`tests/Helpers.php` builds a real `Pandium` object from arrays instead of the environment.
`tests/FakeShipBob.php` serves canned order pages, and `tests/RecordingGorgias.php` records
the four calls that would have reached the API while delegating the helpers — customer key
resolution, payload building — to a real `GorgiasAPI`, so that logic still runs under test.
The two client tests in `tests/ClientsTest.php` send through a Guzzle `MockHandler`, so the
real client runs against canned responses without reaching the network.

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
pandium local build                       # runs the manifest's build command (composer install)
pandium local run <tenant_id>             # cron flow
pandium local run <tenant_id> -m webhook  # webhook flow — see below
```

`--mode` takes `init`, `normal`, or `webhook`, and `--path` points at a directory other than
the current one. A local `.env` overrides anything pulled from Pandium — that is both how
you change one config without touching the tenant, and how you hand the CLI a webhook
payload to run against.

### With a `.env` file

`index.php` loads a `.env` from this directory through `phpdotenv`, which is the same
mechanism Pandium uses in production — environment variables, nothing else. Real environment
variables win over anything the file sets. Create `php/.env`:

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
php -f index.php
```

Logs stream to stderr; the last line on stdout is the JSON that Pandium would merge into
tenant metadata. To simulate resuming, paste that line into `metadata.json` and run again.
`LOG_LEVEL=debug` turns up the verbosity.

### Exercising the webhook flow

Neither route can invent a delivery, so both read the run triggers from `.env` — an array
whose `payload.file` points at a body on disk, exactly as Pandium would supply it. Generate
one with the same helpers the tests use:

```bash
mkdir -p /tmp/wh
php -r '
require "vendor/autoload.php";
use Pandium\Integration\Tests\Helpers;
echo json_encode([Helpers::webhookTrigger("/tmp/wh", Helpers::makeShipmentEvent(), "t1")]), PHP_EOL;
'
```

`Helpers::makeShipmentEvent($shipmentId, $status)` takes any ShipBob status, and
`Helpers::makeOnholdEvent()` next to it builds the harder shape — status details, no
tracking, no recipient email — if you want to exercise the external_id customer path.

Add the printed array to `.env` as `PAN_CTX_RUN_TRIGGERS`. Then run it either way — via the
CLI with `pandium local run <tenant_id> -m webhook`, or on its own by flipping
`PAN_CTX_RUN_MODE` to `webhook` in `.env` and running the entry point again.

> Keep `.env` out of version control — it is already in `php/.gitignore`.
