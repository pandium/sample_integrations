<?php

declare(strict_types=1);

namespace Pandium\Integration;

use DateTimeImmutable;

/** The slice of ShipBob the cron flow needs; tests substitute canned pages. */
interface ShipBobClient
{
    /**
     * One page of orders created since $startDate, oldest first.
     *
     * @return list<array<string, mixed>>
     */
    public function getNewOrdersPage(DateTimeImmutable $startDate, int $page): array;

    /**
     * One page of orders updated since $startDate, newest first.
     *
     * @return list<array<string, mixed>>
     */
    public function getUpdatedOrdersPage(DateTimeImmutable $startDate, int $page): array;

    /**
     * The effective update time of $order relative to $startDate.
     *
     * @param array<string, mixed> $order
     */
    public function getUpdateDate(array $order, DateTimeImmutable $startDate): string;
}
