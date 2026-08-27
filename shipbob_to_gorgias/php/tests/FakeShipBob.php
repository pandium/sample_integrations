<?php

declare(strict_types=1);

namespace Pandium\Integration\Tests;

use Closure;
use DateTimeImmutable;
use Pandium\Integration\ShipBobClient;

/**
 * Serves canned pages for either half and records the pages asked for.
 *
 * $onPage runs before a page is served, which is where a test stands in for the deadline
 * passing or the API going away mid-query.
 */
final class FakeShipBob implements ShipBobClient
{
    /** @var array{new: list<int>, updated: list<int>} */
    public array $pages = ['new' => [], 'updated' => []];

    /**
     * @param list<list<array<string, mixed>>> $newPages
     * @param list<list<array<string, mixed>>> $updatedPages
     */
    public function __construct(
        private readonly array $newPages = [],
        private readonly array $updatedPages = [],
        private readonly ?Closure $onPage = null,
    ) {
    }

    public function getNewOrdersPage(DateTimeImmutable $startDate, int $page): array
    {
        return $this->page('new', $this->newPages, $page);
    }

    public function getUpdatedOrdersPage(DateTimeImmutable $startDate, int $page): array
    {
        return $this->page('updated', $this->updatedPages, $page);
    }

    public function getUpdateDate(array $order, DateTimeImmutable $startDate): string
    {
        return $order['shipments'][0]['last_update_at'];
    }

    /**
     * @param list<list<array<string, mixed>>> $pages
     *
     * @return list<array<string, mixed>>
     */
    private function page(string $half, array $pages, int $page): array
    {
        $this->pages[$half][] = $page;
        ($this->onPage ?? static fn (string $half, int $page) => null)($half, $page);

        return $pages[$page - 1] ?? [];
    }
}
