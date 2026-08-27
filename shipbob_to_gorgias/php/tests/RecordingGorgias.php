<?php

declare(strict_types=1);

namespace Pandium\Integration\Tests;

use Pandium\Integration\GorgiasAPI;
use Pandium\Integration\GorgiasClient;

/**
 * A Gorgias whose four API calls are in-memory recorders; inspect `$log` in assertions.
 *
 * The helpers — customer key resolution, payload building — are delegated to a real
 * GorgiasAPI, so the logic the flows lean on still runs under test. $existingEmails are
 * pre-seeded as customers `findCustomer` will find.
 */
final class RecordingGorgias implements GorgiasClient
{
    /** @var array{create: list<array<string, mixed>>, update: list<array{int, array<string, mixed>}>, ticket: list<array<string, mixed>>} */
    public array $log = ['create' => [], 'update' => [], 'ticket' => []];

    private readonly GorgiasAPI $real;

    /** @var array<string, int> customer key -> id */
    private array $store = [];

    /** @param list<string> $existingEmails */
    public function __construct(array $existingEmails = [])
    {
        $this->real = new GorgiasAPI(Helpers::makePandium(secrets: Helpers::GORGIAS_SECRETS));
        foreach (array_values($existingEmails) as $i => $email) {
            $this->store[$email] = 40 + $i;
        }
    }

    public function findCustomer(?string $email = null, ?string $externalId = null): ?array
    {
        $key = $email ?? $externalId;

        return isset($this->store[$key])
            ? ['id' => $this->store[$key], 'data' => ['pandium' => ['shipbob_orders' => []]]]
            : null;
    }

    public function createCustomer(array $payload): int
    {
        $id = 1000 + count($this->store);
        $this->store[$payload['external_id'] ?? (string) $id] = $id;
        $this->log['create'][] = $payload;

        return $id;
    }

    public function updateCustomer(int $customerId, array $payload): void
    {
        // Snapshot the payload: the flow keeps mutating its copy after this call.
        $this->log['update'][] = [$customerId, json_decode(json_encode($payload), true)];
    }

    public function createTicket(array $payload): array
    {
        $this->log['ticket'][] = $payload;

        return ['id' => 900 + count($this->log['ticket'])];
    }

    public function validEmail(?string $email): string
    {
        return $this->real->validEmail($email);
    }

    public function customerKey(array $sbOrder): string
    {
        return $this->real->customerKey($sbOrder);
    }

    public function newCustomerPayload(array $sbOrder, string $key): array
    {
        return $this->real->newCustomerPayload($sbOrder, $key);
    }

    public function orderDataPayload(array $sbOrder): array
    {
        return $this->real->orderDataPayload($sbOrder);
    }
}
