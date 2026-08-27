<?php

declare(strict_types=1);

namespace Pandium\Integration\Tests;

use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use Pandium\Integration\Cron;
use Pandium\Integration\DeadlineReached;
use Pandium\Integration\Pandium;
use PHPUnit\Framework\TestCase;
use Psr\Log\NullLogger;

final class CronTest extends TestCase
{
    /** Every timestamp in a test is derived from this, so nothing turns on the clock. */
    private DateTimeImmutable $now;

    protected function setUp(): void
    {
        $this->now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public function testRunPagesUntilEmptyUpsertsCustomerAndAdvancesCursor(): void
    {
        $shipbob = new FakeShipBob(newPages: [[
            Helpers::makeOrder(1, $this->ago(6), email: 'jane@example.com'),
            Helpers::makeOrder(2, $this->ago(5), email: 'jane@example.com'),
        ]]);
        $gorgias = new RecordingGorgias();

        $record = $this->cron($shipbob, $gorgias)->run();

        $this->assertSame([1, 2], $shipbob->pages['new']); // paged until the empty page
        $this->assertCount(1, $gorgias->log['create']); // both orders batch onto one customer
        $this->assertSame(substr($this->ago(5), 0, 26), $record['new_order_start_date']); // the last order

        [, $lastWrite] = $gorgias->log['update'][array_key_last($gorgias->log['update'])];
        $ids = array_column($lastWrite['data']['pandium']['shipbob_orders'], 'id');
        sort($ids);
        $this->assertSame([1, 2], $ids);
    }

    /**
     * Pages are each sorted newest-first, but not relative to each other, so the cursor has
     * to be the oldest update seen anywhere — not the last one processed.
     */
    public function testRunAdvancesUpdatedCursorToOldestUpdateAcrossPages(): void
    {
        $shipbob = new FakeShipBob(updatedPages: [
            [Helpers::makeOrder(1, $this->ago(2), email: 'j@x.com'),
                Helpers::makeOrder(2, $this->ago(3), email: 'j@x.com')],
            [Helpers::makeOrder(3, $this->ago(9), email: 'j@x.com'), // oldest update overall
                Helpers::makeOrder(4, $this->ago(8), email: 'j@x.com')],
            [Helpers::makeOrder(5, $this->ago(4), email: 'j@x.com')], // newer again, after the oldest page
        ]);

        $record = $this->cron($shipbob, new RecordingGorgias())->run();

        // Not order 5, the last one processed.
        $this->assertSame(substr($this->ago(9), 0, 23), $record['updated_order_start_date']);
    }

    /**
     * The two cursors resume differently. new_order_start_date climbs per order over an
     * oldest-first query, so it is sound wherever the run stops. updated_order_start_date is
     * the minimum across every page, so it only holds once the query is exhausted — an
     * unread page can carry an older update — and a run cut short flushes the value it
     * started with.
     */
    public function testTimeoutFlushesTheFinishedHalfAndLeavesTheInterruptedOne(): void
    {
        $start = $this->ago(20);
        $shipbob = new FakeShipBob(
            newPages: [[Helpers::makeOrder(1, $this->ago(6), email: 'j@x.com')]],
            updatedPages: [
                [Helpers::makeOrder(2, $this->ago(2), email: 'j@x.com')],
                [Helpers::makeOrder(3, $this->ago(9), email: 'j@x.com')], // never read
            ],
            // Stands in for the alarm the real run arms, which throws the same exception.
            onPage: static function (string $half, int $page): void {
                if ($half === 'updated' && $page === 2) {
                    throw new DeadlineReached('the run-time deadline passed');
                }
            },
        );

        $record = $this->cron($shipbob, new RecordingGorgias(), $start)->run();

        // The run still succeeds, so the caller writes this record and progress merges.
        $this->assertSame(substr($this->ago(6), 0, 26), $record['new_order_start_date']); // that half finished
        $this->assertSame(substr($start, 0, 26), $record['updated_order_start_date']); // this one did not
    }

    private function cron(FakeShipBob $shipbob, RecordingGorgias $gorgias, ?string $startDate = null): Cron
    {
        $pandium = new Pandium(
            ['order_start_date' => $startDate ?? $this->ago(20)],
            Helpers::GORGIAS_SECRETS,
            [],
            new NullLogger(),
        );

        return new Cron($pandium, $shipbob, $gorgias, new NullLogger(), $this->now, newestFirst: false);
    }

    /**
     * A ShipBob-shaped timestamp $days back — seven fractional digits, as the real API sends
     * — inside clamp's 30-day window.
     */
    private function ago(int $days): string
    {
        return $this->now->sub(new DateInterval("P{$days}D"))->format('Y-m-d\TH:i:s') . '.1234567+00:00';
    }
}
