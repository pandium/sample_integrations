<?php

declare(strict_types=1);

namespace Pandium\Integration;

use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * The cron flow: ShipBob orders -> Gorgias customer sidebar.
 *
 * Keeps each Gorgias customer's `data.pandium.shipbob_orders` in sync with their recent
 * ShipBob orders, resuming from cursors stored in tenant metadata.
 *
 * Pandium kills a run after ~10 minutes. A SIGALRM armed a minute inside that limit throws
 * `DeadlineReached`; `run()` catches it and returns the cursor as it stands, so the run
 * exits 0 and its partial progress is merged into metadata for the next run.
 */
final class Cron
{
    /** Self-imposed 9-minute deadline, ahead of Pandium's ~10-minute kill. */
    public const ALARM_SECONDS = 540;

    /** How far back the very first sync may reach, and the floor every later cursor is held to. */
    public const ONE_MONTH = 'P30D';

    /** How many of a customer's most recent orders the sidebar keeps. */
    public const MAX_ORDERS_TO_SYNC = 10;

    /**
     * Customer payloads accumulated within a run, keyed by `customerKey`, so several orders
     * for one customer batch onto the same record.
     *
     * @var array<string, array<string, mixed>>
     */
    private array $cache = [];

    /**
     * The cursor as it stands right now, kept current so a run cut short by the deadline
     * still has something sound to return.
     *
     * @var array<string, string>
     */
    private array $record = [];

    public function __construct(
        private readonly Pandium $pandium,
        private readonly ShipBobClient $shipbob,
        private readonly GorgiasClient $gorgias,
        private readonly LoggerInterface $logger,
        private readonly DateTimeImmutable $now,
        private readonly bool $newestFirst,
    ) {
    }

    public static function fromPandium(Pandium $pandium): self
    {
        return new self(
            $pandium,
            new ShipBobAPI($pandium),
            new GorgiasAPI($pandium),
            Log::get('cron'),
            new DateTimeImmutable('now', new DateTimeZone('UTC')),
            $pandium->configFlag('newest_order_first'),
        );
    }

    /**
     * Sync both halves and return the cursor for the next run.
     *
     * @return array<string, string>
     */
    public function run(): array
    {
        $metadata = $this->pandium->metadata();
        $metadata = is_array($metadata) ? $metadata : [];
        // The tenant's config supplies the start date until the first run writes a cursor.
        $fallback = $this->pandium->config['order_start_date'] ?? null;

        $newCursor = self::clamp(($metadata['new_order_start_date'] ?? '') ?: $fallback, $this->now);
        $updatedCursor = self::clamp(($metadata['updated_order_start_date'] ?? '') ?: $fallback, $this->now);

        $this->record = [
            'new_order_start_date' => self::iso($newCursor),
            'updated_order_start_date' => self::iso($updatedCursor),
        ];

        $this->armDeadline();
        try {
            $this->syncNewOrders($newCursor);
            $this->syncUpdatedOrders($updatedCursor);
        } catch (DeadlineReached) {
            // Not a failure: exit 0 with the partial cursor so Pandium merges it.
            $this->logger->warning('Approaching the run-time limit — flushing the cursor for the next run.');
        } finally {
            $this->cancelDeadline();
        }

        return $this->record;
    }

    /** New orders, oldest first, so the last order processed is always a valid resume point. */
    private function syncNewOrders(DateTimeImmutable $cursor): void
    {
        $this->logger->info("Syncing new ShipBob orders since {$this->record['new_order_start_date']}");
        for ($page = 1;; $page++) {
            $orders = $this->shipbob->getNewOrdersPage($cursor, $page);
            if ($orders === []) {
                break;
            }
            foreach ($orders as $order) {
                $this->logger->info("Processing new order with id {$order['id']}");
                $this->processOrder($order);
                $created = $order['created_date'] ?? '';
                if ($created !== '') {
                    // Trim ShipBob's 7 fractional digits and offset to a microsecond date-time.
                    $this->record['new_order_start_date'] = substr($created, 0, 26);
                }
            }
        }
    }

    /**
     * Updated orders, keyed off shipment last_update_at. Pages are not ordered relative to
     * each other, so the cursor is the oldest update seen and is only committed once every
     * page is in; a run cut short leaves it where it started and re-syncs harmlessly.
     */
    private function syncUpdatedOrders(DateTimeImmutable $cursor): void
    {
        $this->logger->info("Syncing updated ShipBob orders since {$this->record['updated_order_start_date']}");
        $oldestUpdate = null;
        for ($page = 1;; $page++) {
            $orders = $this->shipbob->getUpdatedOrdersPage($cursor, $page);
            if ($orders === []) {
                break;
            }
            foreach ($orders as $order) {
                $this->logger->info("Processing updated order with id {$order['id']}");
                $this->processOrder($order);
                // Fixed-width ISO strings, so a string compare orders them correctly.
                $updateDate = substr($this->shipbob->getUpdateDate($order, $cursor), 0, 23);
                if ($oldestUpdate === null || $updateDate < $oldestUpdate) {
                    $oldestUpdate = $updateDate;
                }
            }
        }

        if ($oldestUpdate !== null) {
            $this->record['updated_order_start_date'] = $oldestUpdate;
        }
    }

    /**
     * Find-or-create the order's Gorgias customer, then PUT/POST its updated
     * `data.pandium.shipbob_orders`.
     *
     * @param array<string, mixed> $sbOrder
     */
    private function processOrder(array $sbOrder): void
    {
        $key = $this->gorgias->customerKey($sbOrder);
        $email = $this->gorgias->validEmail($sbOrder['recipient']['email'] ?? null);

        if (!isset($this->cache[$key])) {
            try {
                $existing = $this->gorgias->findCustomer(
                    $email !== '' ? $email : null,
                    $email !== '' ? null : $key,
                );
            } catch (Throwable $e) {
                $orderId = $sbOrder['id'] ?? '';
                $this->logger->error("Skipping order {$orderId} — cannot fetch customer {$key}: {$e->getMessage()}");

                return;
            }

            if ($existing !== null) {
                // data.pandium may have been hand-edited, so check the type at every level.
                $data = is_array($existing['data'] ?? null) ? $existing['data'] : [];
                $pandium = is_array($data['pandium'] ?? null) ? $data['pandium'] : [];
                if (!is_array($pandium['shipbob_orders'] ?? null)) {
                    $pandium['shipbob_orders'] = [];
                }
                $data['pandium'] = $pandium;
                $this->cache[$key] = ['id' => $existing['id'], 'data' => $data];
            } else {
                $this->cache[$key] = $this->gorgias->newCustomerPayload($sbOrder, $key);
            }
        }

        $customer = $this->cache[$key];
        $customer['data']['pandium']['shipbob_orders'] = $this->upsert(
            $customer['data']['pandium']['shipbob_orders'],
            $this->gorgias->orderDataPayload($sbOrder),
        );

        try {
            if (isset($customer['id'])) {
                $this->gorgias->updateCustomer($customer['id'], $customer);
            } else {
                $customer['id'] = $this->gorgias->createCustomer($customer);
            }
        } catch (Throwable $e) {
            // Skip this customer, not the run; the cursor still advances.
            $this->logger->error("Failed to upsert Gorgias customer {$key}: {$e->getMessage()}");
        }

        $this->cache[$key] = $customer;
    }

    /**
     * Merge $orderPayload into a customer's order list (replace by id, else append), then
     * sort and trim to the most recent MAX_ORDERS_TO_SYNC.
     *
     * @param list<array<string, mixed>> $orders
     * @param array<string, mixed>       $orderPayload
     *
     * @return list<array<string, mixed>>
     */
    private function upsert(array $orders, array $orderPayload): array
    {
        foreach ($orders as $i => $existing) {
            if (($existing['id'] ?? null) === $orderPayload['id']) {
                $orders[$i] = $orderPayload; // in-place replace; no re-sort/trim needed

                return $orders;
            }
        }

        $orders[] = $orderPayload;
        $direction = $this->newestFirst ? -1 : 1;
        usort($orders, static fn (array $a, array $b): int => (($a['id'] ?? 0) <=> ($b['id'] ?? 0)) * $direction);
        if (count($orders) > self::MAX_ORDERS_TO_SYNC) {
            $orders = $this->newestFirst
                ? array_slice($orders, 0, self::MAX_ORDERS_TO_SYNC)
                : array_slice($orders, -self::MAX_ORDERS_TO_SYNC);
        }

        return $orders;
    }

    /**
     * Hold a cursor within [now - 1 month, now]; a missing or unparseable value starts at
     * the floor.
     */
    private static function clamp(mixed $value, DateTimeImmutable $now): DateTimeImmutable
    {
        $floor = $now->sub(new DateInterval(self::ONE_MONTH));
        if (!is_string($value) || $value === '') {
            return $floor;
        }
        try {
            $parsed = (new DateTimeImmutable($value))->setTimezone(new DateTimeZone('UTC'));
        } catch (Throwable) {
            return $floor;
        }

        return min(max($parsed, $floor), $now);
    }

    /** A cursor as the metadata record and ShipBob's query parameters want it. */
    private static function iso(DateTimeImmutable $value): string
    {
        return $value->format('Y-m-d\TH:i:s.u');
    }

    /** Arm the self-imposed deadline; the handler throws into whichever loop is running. */
    private function armDeadline(): void
    {
        if (!function_exists('pcntl_alarm')) {
            $this->logger->warning('pcntl is unavailable; this run has no self-imposed deadline.');

            return;
        }
        pcntl_async_signals(true);
        pcntl_signal(SIGALRM, static function (): never {
            throw new DeadlineReached('the run-time deadline passed');
        });
        pcntl_alarm(self::ALARM_SECONDS);
    }

    private function cancelDeadline(): void
    {
        if (function_exists('pcntl_alarm')) {
            pcntl_alarm(0);
            pcntl_signal(SIGALRM, SIG_DFL);
        }
    }
}
