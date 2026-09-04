<?php

declare(strict_types=1);

namespace Pandium\Integration\Tests;

use Pandium\Integration\Pandium;
use Psr\Log\NullLogger;

/** Shared test doubles and factories — nothing here touches the network. */
final class Helpers
{
    public const GORGIAS_SECRETS = [
        'gorgias_oauth_access_token' => 'gorgias-token-123',
        'gorgias_oauth_account' => 'acme',
    ];

    /**
     * Build a Pandium directly (no env). $metadata is written to a file under $tmpPath so
     * `metadata()` reads it back like the real thing.
     *
     * @param array<string, string>     $config
     * @param array<string, string>     $secrets
     * @param list<array<string, mixed>> $runTriggers
     * @param array<string, mixed>      $metadata
     */
    public static function makePandium(
        array $config = [],
        array $secrets = [],
        ?array $runTriggers = null,
        ?array $metadata = null,
        ?string $runMode = null,
        ?string $tmpPath = null,
    ): Pandium {
        $context = [];
        if ($runMode !== null) {
            $context['run_mode'] = $runMode;
        }
        if ($runTriggers !== null) {
            $context['run_triggers'] = json_encode($runTriggers);
        }
        if ($metadata !== null) {
            $path = $tmpPath . '/metadata.json';
            file_put_contents($path, json_encode($metadata));
            $context['tenant_metadata_file'] = $path;
        }

        return new Pandium($config, $secrets, $context, new NullLogger());
    }

    /** A ShipBob token whose `iss` claim is $issuer, in the three-part shape a JWT has. */
    public static function token(string $issuer): string
    {
        $payload = rtrim(strtr(base64_encode(json_encode(['iss' => $issuer])), '+/', '-_'), '=');

        return "header.{$payload}.sig";
    }

    /** @return array<string, mixed> */
    public static function makeOrder(int $id, string $created, ?string $email = null, ?string $lastUpdate = null): array
    {
        return [
            'id' => $id,
            'created_date' => $created,
            'reference_id' => "REF-{$id}",
            'recipient' => [
                'email' => $email,
                'name' => 'Buyer',
                'address' => ['address1' => '1 Main St', 'city' => 'NY', 'country' => 'US'],
            ],
            'shipments' => [['id' => $id * 10, 'last_update_at' => $lastUpdate ?? $created]],
        ];
    }

    /**
     * A ShipBob shipment webhook body. Every order-related topic delivers this same object;
     * $status and $statusDetails are what vary between them.
     *
     * @param list<array<string, mixed>> $statusDetails
     *
     * @return array<string, mixed>
     */
    public static function makeShipmentEvent(
        int $shipmentId = 456789,
        string $status = 'Delivered',
        ?string $email = 'jane@example.com',
        array $statusDetails = [],
    ): array {
        return [
            'id' => $shipmentId,
            'order_id' => 289012345,
            'reference_id' => 'MERCHANT-ORDER-1001',
            'status' => $status,
            'status_details' => $statusDetails,
            'tracking' => ['carrier' => 'USPS', 'tracking_number' => '9400100000000000000000'],
            'delivery_date' => '2026-07-09T18:22:00Z',
            'products' => [[
                'name' => 'Pinnacle Shampoo',
                'sku' => 'PIN-100',
                'inventory_items' => [['name' => 'Pinnacle Shampoo', 'quantity' => 4]],
            ]],
            'recipient' => [
                'name' => 'Jane Buyer',
                'email' => $email,
                'address' => ['address1' => '100 Nowhere Blvd', 'city' => 'Gotham City', 'country' => 'US'],
            ],
        ];
    }

    /**
     * An OnHold shipment: status details, no tracking, and no recipient email.
     *
     * @return array<string, mixed>
     */
    public static function makeOnholdEvent(int $shipmentId = 107414278): array
    {
        $event = self::makeShipmentEvent($shipmentId, 'OnHold', null, [
            ['id' => 401, 'name' => 'InvalidAddress', 'description' => 'Invalid Address'],
            ['id' => 400, 'name' => 'PaymentDeclined', 'description' => 'Payment Failure'],
        ]);
        $event['tracking'] = null;
        $event['delivery_date'] = null;

        return $event;
    }

    /**
     * Write an event to disk and wrap it in a trigger, the way Pandium hands one over.
     *
     * @param array<string, mixed> $event
     *
     * @return array<string, mixed>
     */
    public static function webhookTrigger(string $tmpPath, array $event, string $id, string $source = 'webhook'): array
    {
        $path = "{$tmpPath}/{$id}.json";
        file_put_contents($path, json_encode($event));

        return ['id' => $id, 'source' => $source, 'mode' => $source, 'payload' => ['file' => $path]];
    }
}
