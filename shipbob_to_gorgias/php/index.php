<?php

declare(strict_types=1);

use Dotenv\Dotenv;
use Pandium\Integration\Cron;
use Pandium\Integration\Log;
use Pandium\Integration\Pandium;
use Pandium\Integration\Webhook;

require __DIR__ . '/vendor/autoload.php';

// Pandium passes secrets, configs, and context as environment variables; a local .env
// stands in for them during development (Immutable: real env vars win over the file).
Dotenv::createUnsafeImmutable(__DIR__)->safeLoad();

$logger = Log::get('index');
$pandium = Pandium::fromEnv($logger);

$logger->info('Syncing ShipBob to Gorgias; this run is in mode: ' . ($pandium->runMode() ?? 'normal'));

try {
    $metadata = match ($pandium->runMode()) {
        // Webhook mode: ShipBob shipment webhooks -> Gorgias tickets.
        'webhook' => Webhook::fromPandium($pandium)->run(),

        // Normal mode: the scheduled ShipBob orders -> Gorgias customers sync.
        default => Cron::fromPandium($pandium)->run(),
    };
} catch (Throwable $e) {
    // Nothing reaches stdout, so Pandium keeps the previous run's metadata and the next
    // run resumes from there.
    $logger->error(sprintf('%s: %s', $e::class, $e->getMessage()));

    exit(1);
}

$pandium->updateMetadata($metadata);
