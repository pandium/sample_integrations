<?php

declare(strict_types=1);

namespace Pandium\Integration;

use DateTimeImmutable;
use DateTimeZone;
use GuzzleHttp\ClientInterface;
use JsonException;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Throwable;

/**
 * ShipBob API client for the cron sync. Auth is the bearer token Pandium supplies as
 * `PAN_SEC_SHIPBOB_ACCESS_TOKEN`; its `iss` claim picks the prod or sandbox base URL.
 */
final class ShipBobAPI implements ShipBobClient
{
    /** Token issuer -> API base URL; anything unrecognized falls back to prod. */
    private const AUTH_URL_TO_BASE_URL = [
        'https://authstage.shipbob.com' => 'https://sandbox-api.shipbob.com/2026-01',
        'https://auth.shipbob.com' => 'https://api.shipbob.com/2026-01',
    ];

    public const DEFAULT_BASE_URL = 'https://api.shipbob.com/2026-01';

    /** The format both cursors and ShipBob's own timestamps are compared in. */
    private const TIMESTAMP_FORMAT = 'Y-m-d\TH:i:s.u';

    public readonly string $apiUrl;

    private readonly ClientInterface $http;

    private readonly LoggerInterface $logger;

    /** $handler and $retryDelayMs let tests send through a mock handler without sleeping. */
    public function __construct(Pandium $pandium, ?callable $handler = null, int $retryDelayMs = 3000)
    {
        $token = $pandium->secrets['shipbob_access_token'] ?? '';
        if ($token === '') {
            throw new RuntimeException('PAN_SEC_SHIPBOB_ACCESS_TOKEN is required');
        }

        $this->logger = Log::get('shipbob');
        $this->apiUrl = self::resolveBaseUrl($token, $this->logger);
        $this->http = Http::client([
            'accept' => 'application/json',
            'content-type' => 'application/json',
            'Authorization' => "Bearer {$token}",
        ], $retryDelayMs, $handler);
    }

    /** Decode the JWT payload and map its `iss` claim to an API base URL. */
    public static function resolveBaseUrl(string $token, ?LoggerInterface $logger = null): string
    {
        try {
            $payload = explode('.', $token)[1] ?? throw new RuntimeException('token has no payload');
            $claims = json_decode(
                base64_decode(strtr($payload, '-_', '+/'), true) ?: '',
                true,
                512,
                JSON_THROW_ON_ERROR,
            );

            return self::AUTH_URL_TO_BASE_URL[$claims['iss'] ?? ''] ?? self::DEFAULT_BASE_URL;
        } catch (Throwable $e) {
            // A bad token fails on the first request anyway; prod is the safe guess.
            $logger?->warning("Could not resolve ShipBob base URL from token: {$e->getMessage()}");

            return self::DEFAULT_BASE_URL;
        }
    }

    /**
     * GET one page of `/order`. Only an exhausted query answers [], because the caller
     * commits its cursor there; anything else throws.
     *
     * @param array<string, string|int> $params
     *
     * @return list<array<string, mixed>>
     */
    private function getOrders(array $params): array
    {
        $query = json_encode($params);
        try {
            $res = $this->http->request('GET', "{$this->apiUrl}/order", ['query' => $params]);
            $data = json_decode((string) $res->getBody(), true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException("ShipBob answered /order ({$query}) with unparseable JSON", 0, $e);
        } catch (Throwable $e) {
            $this->logger->error("ShipBob order fetch failed ({$query}): {$e->getMessage()}");

            throw $e;
        }

        if ($data === null) { // a page past the end may have no body
            return [];
        }
        if (!array_is_list($data)) {
            throw new RuntimeException("ShipBob answered /order ({$query}) with " . json_encode($data));
        }

        return $data;
    }

    public function getNewOrdersPage(DateTimeImmutable $startDate, int $page): array
    {
        return $this->getOrders([
            'StartDate' => $startDate->format(self::TIMESTAMP_FORMAT),
            'Page' => $page,
            'SortOrder' => 'Oldest',
        ]);
    }

    /**
     * One page of orders updated since $startDate, newest first. ShipBob puts
     * `last_update_at` on shipments, not orders, so the per-order date is derived.
     */
    public function getUpdatedOrdersPage(DateTimeImmutable $startDate, int $page): array
    {
        $orders = $this->getOrders([
            'LastUpdateStartDate' => $startDate->format(self::TIMESTAMP_FORMAT),
            'Page' => $page,
        ]);

        $keyed = array_map(fn (array $order): array => [$order, $this->getUpdateDate($order, $startDate)], $orders);
        usort($keyed, static fn (array $a, array $b): int => strcmp($b[1], $a[1]));

        return array_column($keyed, 0);
    }

    /**
     * The oldest shipment `last_update_at` on $order that still falls after $startDate;
     * defaults to now when none qualify.
     */
    public function getUpdateDate(array $order, DateTimeImmutable $startDate): string
    {
        $start = $startDate->format(self::TIMESTAMP_FORMAT);
        $updateDate = (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format(self::TIMESTAMP_FORMAT);
        foreach ($order['shipments'] ?? [] as $shipment) {
            $timestamp = $shipment['last_update_at'] ?? '';
            if ($timestamp !== '' && $start < $timestamp && $timestamp < $updateDate) {
                $updateDate = $timestamp;
            }
        }

        return $updateDate;
    }
}
