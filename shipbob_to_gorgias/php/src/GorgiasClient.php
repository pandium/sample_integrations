<?php

declare(strict_types=1);

namespace Pandium\Integration;

/** The slice of Gorgias both flows need; tests substitute a recording stand-in. */
interface GorgiasClient
{
    /**
     * The customer with this email or external_id, or null if there is none.
     *
     * @return array<string, mixed>|null
     */
    public function findCustomer(?string $email = null, ?string $externalId = null): ?array;

    /**
     * @param array<string, mixed> $payload
     *
     * @return int the new customer's id
     */
    public function createCustomer(array $payload): int;

    /** @param array<string, mixed> $payload */
    public function updateCustomer(int $customerId, array $payload): void;

    /**
     * @param array<string, mixed> $payload
     *
     * @return array<string, mixed> the created ticket
     */
    public function createTicket(array $payload): array;

    /** $email if Gorgias would accept it, else ''. */
    public function validEmail(?string $email): string;

    /**
     * The key identifying the customer a ShipBob order or shipment belongs to.
     *
     * @param array<string, mixed> $sbOrder
     */
    public function customerKey(array $sbOrder): string;

    /**
     * @param array<string, mixed> $sbOrder
     *
     * @return array<string, mixed>
     */
    public function newCustomerPayload(array $sbOrder, string $key): array;

    /**
     * @param array<string, mixed> $sbOrder
     *
     * @return array<string, mixed>
     */
    public function orderDataPayload(array $sbOrder): array;
}
