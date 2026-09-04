<?php

declare(strict_types=1);

namespace Pandium\Integration;

use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

/** The HTTP setup both API clients share: default headers plus retry with backoff. */
final class Http
{
    /** How many times a retryable response is retried before the error surfaces. */
    private const MAX_RETRIES = 6;

    /** Statuses worth another attempt: rate limiting and the transient gateway errors. */
    private const RETRY_STATUSES = [429, 502, 503, 504];

    /**
     * A client sending $headers on every request, retrying with exponential backoff from
     * $delayMs. Tests pass a mock $handler so no request leaves the process.
     *
     * @param array<string, string> $headers
     */
    public static function client(array $headers, int $delayMs, ?callable $handler = null): Client
    {
        $stack = HandlerStack::create($handler);
        $stack->push(Middleware::retry(
            static fn (int $retries, RequestInterface $request, ?ResponseInterface $response = null): bool
                => $retries < self::MAX_RETRIES
                && $response !== null
                && in_array($response->getStatusCode(), self::RETRY_STATUSES, true),
            static fn (int $retries): int => $delayMs * 2 ** ($retries - 1),
        ));

        return new Client(['handler' => $stack, 'headers' => $headers]);
    }
}
