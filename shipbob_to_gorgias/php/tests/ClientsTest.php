<?php

declare(strict_types=1);

namespace Pandium\Integration\Tests;

use DateTimeImmutable;
use GuzzleHttp\Exception\ServerException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\Psr7\Response;
use Pandium\Integration\ShipBobAPI;
use PHPUnit\Framework\TestCase;

final class ClientsTest extends TestCase
{
    public function testShipBobBaseUrlIsResolvedFromTokenIssuer(): void
    {
        $this->assertSame(
            'https://sandbox-api.shipbob.com/2026-01',
            ShipBobAPI::resolveBaseUrl(Helpers::token('https://authstage.shipbob.com')),
        );
        $this->assertSame(
            'https://api.shipbob.com/2026-01',
            ShipBobAPI::resolveBaseUrl(Helpers::token('https://auth.shipbob.com')),
        );
        // Malformed -> prod.
        $this->assertSame(ShipBobAPI::DEFAULT_BASE_URL, ShipBobAPI::resolveBaseUrl('not-a-jwt'));
    }

    /**
     * The cron loop stops on an empty page and commits its cursor there, so only an
     * exhausted query may answer with one.
     */
    public function testShipBobOrderPageRaisesInsteadOfReportingItselfEmpty(): void
    {
        $start = new DateTimeImmutable('2026-07-01T00:00:00Z');

        $this->assertSame([], $this->shipbob([new Response(200, [], '[]')])->getNewOrdersPage($start, 1));

        // A failure, not an empty page — after the retries the client gives up loudly.
        $this->expectException(ServerException::class);
        $this->shipbob(array_fill(0, 7, new Response(503)))->getNewOrdersPage($start, 1);
    }

    /** The real client, sending through a mock handler so no request leaves the process. */
    private function shipbob(array $responses): ShipBobAPI
    {
        return new ShipBobAPI(
            Helpers::makePandium(secrets: ['shipbob_access_token' => Helpers::token('https://auth.shipbob.com')]),
            new MockHandler($responses),
            retryDelayMs: 0,
        );
    }
}
