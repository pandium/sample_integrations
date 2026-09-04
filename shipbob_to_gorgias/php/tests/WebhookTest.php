<?php

declare(strict_types=1);

namespace Pandium\Integration\Tests;

use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use Pandium\Integration\Webhook;
use PHPUnit\Framework\TestCase;
use Psr\Log\NullLogger;

final class WebhookTest extends TestCase
{
    private DateTimeImmutable $now;

    private string $tmpPath;

    protected function setUp(): void
    {
        $this->now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $this->tmpPath = sys_get_temp_dir() . '/sb2gorgias-' . uniqid();
        mkdir($this->tmpPath);
    }

    protected function tearDown(): void
    {
        array_map(unlink(...), glob("{$this->tmpPath}/*") ?: []);
        rmdir($this->tmpPath);
    }

    public function testRunOpensTicketAndWritesOnlyProcessedEvents(): void
    {
        $triggers = [Helpers::webhookTrigger($this->tmpPath, Helpers::makeShipmentEvent(456789), 't1')];

        [$result, $gorgias] = $this->runWebhook($triggers);

        $ticket = $gorgias->log['ticket'][0];
        $this->assertSame(['id' => 40], $ticket['customer']); // linked to the found customer
        $this->assertSame(
            [['name' => 'shipbob-shipment'], ['name' => 'shipbob-delivered']],
            $ticket['tags'],
        );
        $this->assertStringContainsString('is now Delivered', $ticket['messages'][0]['body_text']);
        $this->assertStringContainsString('USPS 9400100000000000000000', $ticket['messages'][0]['body_text']);
        $this->assertSame(['processed_events'], array_keys($result)); // leaves the cursor keys alone
        $this->assertArrayHasKey('456789:Delivered', (array) $result['processed_events']);
    }

    /**
     * Dedupe is per shipment *and* status: a redelivery is dropped, while a genuine next
     * status for the same shipment still opens its own ticket. Entries older than the
     * 30-minute window are pruned out of the map on the way through.
     */
    public function testRunDedupesPerShipmentAndStatusAndPrunesStaleEntries(): void
    {
        $triggers = [
            Helpers::webhookTrigger($this->tmpPath, Helpers::makeShipmentEvent(1, 'OnHold'), 't1'),
            Helpers::webhookTrigger($this->tmpPath, Helpers::makeShipmentEvent(1, 'OnHold'), 't2'), // duplicate
            Helpers::webhookTrigger($this->tmpPath, Helpers::makeShipmentEvent(1, 'Delivered'), 't3'),
        ];
        $metadata = ['processed_events' => [
            '456790:Delivered' => $this->now->format('c'),                                  // recent -> kept
            '999999:Delivered' => $this->now->sub(new DateInterval('PT45M'))->format('c'),  // >30 min -> pruned
        ]];

        [$result, $gorgias] = $this->runWebhook($triggers, $metadata);

        // Two tickets from three deliveries: the redelivery is dropped, the new status is not.
        $this->assertCount(2, $gorgias->log['ticket']);
        $this->assertSame(
            ['456790:Delivered', '1:OnHold', '1:Delivered'],
            array_keys((array) $result['processed_events']),
        );
    }

    public function testRunCreatesCustomerByExternalIdWhenRecipientHasNoEmail(): void
    {
        $triggers = [Helpers::webhookTrigger($this->tmpPath, Helpers::makeOnholdEvent(), 't1')];

        [$result, $gorgias] = $this->runWebhook($triggers);

        $created = $gorgias->log['create'][0];
        $this->assertArrayNotHasKey('email', $created);
        // The synthetic key the cron flow uses too: name address1 city country.
        $this->assertSame('Jane Buyer 100 Nowhere Blvd Gotham City US', $created['external_id']);

        $ticket = $gorgias->log['ticket'][0];
        $this->assertSame(['id' => 1001], $ticket['customer']); // the customer we just created
        $body = $ticket['messages'][0]['body_text'];
        $this->assertStringContainsString('is now OnHold', $body);
        $this->assertStringContainsString('Reason: Invalid Address; Payment Failure', $body);
        $this->assertStringNotContainsString('Tracking:', $body); // OnHold shipments carry none
        $this->assertStringContainsString('4 x Pinnacle Shampoo (PIN-100)', $body);
        $this->assertSame(['107414278:OnHold'], array_keys((array) $result['processed_events']));
    }

    /**
     * @param list<array<string, mixed>> $triggers
     * @param array<string, mixed>|null  $metadata
     * @param list<string>               $existing
     *
     * @return array{array<string, mixed>, RecordingGorgias}
     */
    private function runWebhook(array $triggers, ?array $metadata = null, array $existing = ['jane@example.com']): array
    {
        $gorgias = new RecordingGorgias($existing);
        $pandium = Helpers::makePandium(
            secrets: Helpers::GORGIAS_SECRETS,
            runTriggers: $triggers,
            metadata: $metadata,
            runMode: 'webhook',
            tmpPath: $this->tmpPath,
        );

        return [(new Webhook($pandium, $gorgias, new NullLogger(), $this->now))->run(), $gorgias];
    }
}
