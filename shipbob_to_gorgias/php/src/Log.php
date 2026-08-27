<?php

declare(strict_types=1);

namespace Pandium\Integration;

use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Level;
use Monolog\Logger;
use Psr\Log\LoggerInterface;

/**
 * Shared logging setup. Logs go to stderr because stdout carries the JSON metadata Pandium
 * reads back. LOG_LEVEL changes verbosity.
 */
final class Log
{
    private static ?StreamHandler $handler = null;

    public static function get(string $channel): LoggerInterface
    {
        if (self::$handler === null) {
            $handler = new StreamHandler('php://stderr', Level::fromName(getenv('LOG_LEVEL') ?: 'info'));
            $handler->setFormatter(new LineFormatter(
                format: "[%datetime%] %channel%.%level_name%: %message%%context%%extra%\n",
                dateFormat: 'Y-m-d H:i:s.v',
                ignoreEmptyContextAndExtra: true,
            ));
            self::$handler = $handler;
        }

        return new Logger($channel, [self::$handler]);
    }
}
