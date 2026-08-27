<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Level;
use Monolog\Logger;
use Pandium\Integration\Pandium;
use Psr\Log\LoggerInterface;

// Pandium sets secrets, configs, and context as environment variables; a local .env file
// stands in for them during development. The Unsafe factory additionally calls putenv() so
// the values reach getenv(); it is unsafe only in the sense that putenv() is not
// thread-safe, which does not apply to a CLI script. Immutable keeps real environment
// variables winning over anything a stray .env sets.
Dotenv::createUnsafeImmutable(__DIR__)->safeLoad();

// Logs go to stderr; stdout carries the JSON metadata Pandium reads back. Set LOG_LEVEL
// (e.g. to `debug`) to change verbosity without rebuilding.
$handler = new StreamHandler('php://stderr', Level::fromName(getenv('LOG_LEVEL') ?: 'info'));
// Monolog's default format leaves a trailing space where it strips an empty %context%
// and %extra%; omitting the separators keeps plain lines clean. Add a space back before
// %context% if you start passing context arrays and want them set off from the message.
$handler->setFormatter(new LineFormatter(
    format: "[%datetime%] %channel%.%level_name%: %message%%context%%extra%\n",
    dateFormat: 'Y-m-d H:i:s.v',
    ignoreEmptyContextAndExtra: true,
));
$logger = new Logger('main');
$logger->pushHandler($handler);

/**
 * The business logic of the run varies depending on the run mode.
 *
 * @return array<string, mixed>
 */
function run(?string $mode, Pandium $pandium, LoggerInterface $logger): array
{
    switch ($mode) {
        // Init mode: report which secrets are available and populate tenant metadata with
        // the dynamic config values needed for the customer-facing config form. In the real
        // world, these values would be derived from an api call.
        case 'init':
            $logger->info('The available secrets are: ' . implode(', ', array_keys($pandium->secrets)));

            return ['dynamic_colors' => ['red', 'green', 'purple', 'orange', 'yellow']];

            // Webhook mode: log each trigger's headers and body. This version emits no
            // metadata, but there is no reason not to update metadata from here.
        case 'webhook':
            foreach ($pandium->webhookPayloads() as $payload) {
                $logger->info('headers: ' . json_encode($payload['headers']));
                $logger->info('body: ' . json_encode($payload['body']));
            }

            return [];

            // Normal mode: log the config, then log the previous normal run's random number
            // and store a fresh random number as metadata.
        default:
            $logger->info('Tenant configs: ' . json_encode($pandium->config));
            $newRandomNumber = random_int(0, 999_999);
            $previous = $pandium->metadata();
            if ($previous !== null) {
                $logger->info("last run's random number: " . json_encode($previous['random_number'] ?? null));
            }
            $logger->info("new random number: {$newRandomNumber}");

            return ['random_number' => $newRandomNumber];
    }
}

$pandium = Pandium::fromEnv($logger);

$logger->info('Hello from a Pandium integration, written in PHP!');
$logger->info('This run is in mode: ' . ($pandium->runMode() ?? ''));

$pandium->updateMetadata(run($pandium->runMode(), $pandium, $logger));
