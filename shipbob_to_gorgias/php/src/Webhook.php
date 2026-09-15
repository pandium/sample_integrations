<?php

declare(strict_types=1);

namespace Pandium\Integration;

use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * The webhook flow: any ShipBob shipment webhook -> a Gorgias ticket.
 *
 * ShipBob's order topics all deliver the same shipment object, differing only in `status`,
 * and every one gets a ticket. ShipBob retries deliveries and Pandium bundles debounced
 * ones into a single run, so tickets are deduped on `shipment_id:status` via a
 * `processed_events` map kept in tenant metadata and pruned to a 30-minute window.
 *
 * Tenant metadata is shallow-merged at the top level, so returning the whole map replaces
 * it while leaving the cron flow's cursor keys untouched. Pandium has already verified
 * each delivery's signature by the time it reaches the run.
 */
final class Webhook
{
    /** How long a handled `shipment_id:status` stays in the dedupe map. */
    public const PRUNE_WINDOW = 'PT30M';

    /** On every ticket, so this flow's work can be found in Gorgias as a group. */
    public const SHIPMENT_TAG = 'shipbob-shipment';

    public function __construct(
        private readonly Pandium $pandium,
        private readonly GorgiasClient $gorgias,
        private readonly LoggerInterface $logger,
        private readonly DateTimeImmutable $now,
    ) {
    }

    public static function fromPandium(Pandium $pandium): self
    {
        return new self(
            $pandium,
            new GorgiasAPI($pandium),
            Log::get('webhook'),
            new DateTimeImmutable('now', new DateTimeZone('UTC')),
        );
    }

    /**
     * Ticket every delivery this run was handed, and return the dedupe map to store.
     *
     * @return array{processed_events: object}
     */
    public function run(): array
    {
        $metadata = $this->pandium->metadata();
        $metadata = is_array($metadata) ? $metadata : [];
        $processed = self::prune($metadata['processed_events'] ?? [], $this->now);

        $nowIso = $this->now->format('Y-m-d\TH:i:sP');
        $created = 0;

        foreach ($this->pandium->webhookPayloads() as $delivery) {
            $event = $delivery['body'];
            if (!is_array($event)) {
                $this->logger->error("Webhook delivery {$delivery['id']} is not a JSON object; skipping.");

                continue;
            }

            $shipmentId = self::shipmentId($event);
            if ($shipmentId === '') {
                $this->logger->warning("Webhook delivery {$delivery['id']} has no shipment id; skipping.");

                continue;
            }

            // The status is part of the dedupe key, never a filter.
            $status = $event['status'] ?? 'Updated';
            $eventKey = "{$shipmentId}:{$status}";
            if (isset($processed[$eventKey])) {
                $this->logger->info("Shipment {$shipmentId} is already ticketed as {$status}; skipping duplicate.");

                continue;
            }

            try {
                $customerRef = $this->resolveCustomer($event);
            } catch (Throwable $e) {
                // Left unprocessed so ShipBob's retry can try again.
                $this->logger->error(
                    "Could not resolve a Gorgias customer for shipment {$shipmentId}: {$e->getMessage()}"
                );

                continue;
            }

            try {
                $ticket = $this->gorgias->createTicket(self::buildTicket($event, $customerRef));
            } catch (Throwable $e) {
                // Left unprocessed so ShipBob's retry can try again.
                $this->logger->error("Failed to open ticket for shipment {$shipmentId}: {$e->getMessage()}");

                continue;
            }

            $processed[$eventKey] = $nowIso;
            $created++;
            $ticketId = $ticket['id'] ?? '';
            $this->logger->info("Opened Gorgias ticket {$ticketId} for shipment {$shipmentId} ({$status}).");
        }

        $tracking = count($processed);
        $this->logger->info("Webhook flow: opened {$created} ticket(s); tracking {$tracking} event(s).");

        // Cast so an empty map encodes as `{}`, which the metadata schema requires.
        return ['processed_events' => (object) $processed];
    }

    /**
     * Find-or-create the Gorgias customer for the shipment's recipient, keyed the same way
     * the cron flow keys them so the ticket lands on the record carrying the order history.
     *
     * @param array<string, mixed> $event
     *
     * @return array{id: int}
     */
    private function resolveCustomer(array $event): array
    {
        $email = $this->gorgias->validEmail($event['recipient']['email'] ?? null);
        $key = $this->gorgias->customerKey($event);

        $existing = $this->gorgias->findCustomer(
            $email !== '' ? $email : null,
            $email !== '' ? null : $key,
        );
        if ($existing !== null) {
            return ['id' => (int) $existing['id']];
        }

        return ['id' => $this->gorgias->createCustomer($this->gorgias->newCustomerPayload($event, $key))];
    }

    /**
     * The POST /tickets payload. Gorgias wants the customer both as the ticket's owner and
     * as the sender of its first message.
     *
     * @param array<string, mixed> $event
     * @param array{id: int}       $customerRef
     *
     * @return array<string, mixed>
     */
    private static function buildTicket(array $event, array $customerRef): array
    {
        $shipmentId = self::shipmentId($event);
        $orderId = $event['order_id'] ?? '';
        $referenceId = ($event['reference_id'] ?? '') ?: $orderId;
        $status = $event['status'] ?? 'Updated';
        $reasons = self::statusDetails($event);
        $carrier = $event['tracking']['carrier'] ?? '';
        $trackingNumber = $event['tracking']['tracking_number'] ?? '';
        $deliveredOn = substr((string) ($event['delivery_date'] ?? ''), 0, 10); // YYYY-MM-DD
        $items = self::items($event);

        $headline = "Shipment {$shipmentId} for order {$referenceId} is now {$status}.";

        // Only the parts ShipBob sent for this status go in; body_html escapes them.
        $lines = [$headline];
        $html = ['<p>' . htmlspecialchars($headline) . '</p>'];
        if ($reasons !== '') {
            $lines[] = "Reason: {$reasons}";
            $html[] = '<p><b>Reason:</b> ' . htmlspecialchars($reasons) . '</p>';
        }
        if ($carrier !== '' || $trackingNumber !== '') {
            $lines[] = trim("Tracking: {$carrier} {$trackingNumber}");
            $html[] = '<p><b>Tracking:</b> ' . htmlspecialchars("{$carrier} {$trackingNumber}") . '</p>';
        }
        if ($deliveredOn !== '') {
            $lines[] = "Delivered on: {$deliveredOn}";
        }
        if ($items !== '') {
            $lines[] = "Items:\n{$items}";
            $escaped = array_map(htmlspecialchars(...), explode("\n", $items));
            $html[] = '<ul><li>' . implode('</li><li>', $escaped) . '</li></ul>';
        }

        $message = [
            'sender' => $customerRef,
            'channel' => 'api',
            'via' => 'api',
            'from_agent' => false,
            'subject' => "Order {$referenceId}: shipment {$status}",
            'body_text' => implode("\n", $lines),
            'body_html' => implode('', $html),
            // Lets Gorgias auto-reply and keyword rules fire.
            'stripped_text' => $headline,
        ];

        return [
            'customer' => $customerRef,
            'channel' => 'api',
            'via' => 'api',
            'from_agent' => false,
            'status' => 'open',
            'messages' => [$message],
            // A constant tag to find this flow's tickets, plus the status for Gorgias rules.
            'tags' => [
                ['name' => self::SHIPMENT_TAG],
                ['name' => 'shipbob-' . str_replace(' ', '-', strtolower((string) $status))],
            ],
        ];
    }

    /**
     * Drop entries older than PRUNE_WINDOW (or unparseable).
     *
     * @param array<string, string> $processed
     *
     * @return array<string, string>
     */
    private static function prune(array $processed, DateTimeImmutable $now): array
    {
        $cutoff = $now->sub(new DateInterval(self::PRUNE_WINDOW));
        $kept = [];
        foreach ($processed as $eventKey => $timestamp) {
            try {
                $when = new DateTimeImmutable((string) $timestamp);
            } catch (Throwable) {
                continue;
            }
            if ($when >= $cutoff) {
                $kept[$eventKey] = $timestamp;
            }
        }

        return $kept;
    }

    /**
     * ShipBob sends the shipment as `id` or, on some topics, `shipment_id`.
     *
     * @param array<string, mixed> $event
     */
    private static function shipmentId(array $event): string
    {
        return (string) (($event['id'] ?? '') ?: ($event['shipment_id'] ?? ''));
    }

    /**
     * The reasons ShipBob attached to this status, e.g. `Invalid Address; Payment Failure`.
     *
     * @param array<string, mixed> $event
     */
    private static function statusDetails(array $event): string
    {
        $reasons = [];
        foreach ($event['status_details'] ?? [] as $detail) {
            if ($detail) {
                $reasons[] = ($detail['description'] ?? '') ?: ($detail['name'] ?? '');
            }
        }

        return implode('; ', $reasons);
    }

    /**
     * One line per product on the shipment: `4 x 16 oz. Shampoo (PIN-100)`.
     *
     * @param array<string, mixed> $event
     */
    private static function items(array $event): string
    {
        $lines = [];
        foreach ($event['products'] ?? [] as $product) {
            $quantity = 0;
            foreach ($product['inventory_items'] ?? [] as $item) {
                $quantity += $item['quantity'] ?? 0;
            }
            $sku = ($product['sku'] ?? '') ?: ($product['reference_id'] ?? '');
            $lines[] = "{$quantity} x " . ($product['name'] ?? '') . ($sku !== '' ? " ({$sku})" : '');
        }

        return implode("\n", $lines);
    }
}
