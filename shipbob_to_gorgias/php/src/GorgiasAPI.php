<?php

declare(strict_types=1);

namespace Pandium\Integration;

use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;
use RuntimeException;
use stdClass;
use Throwable;

/**
 * Gorgias API client: the cron flow upserts customers, the webhook flow creates tickets.
 *
 * Auth is OAuth2 via Pandium's `gorgias-oauth` connector. Pandium runs the authorization
 * flow and refreshes the token itself, so this client just sends whatever access token is
 * current for the run; a failed refresh surfaces on the run as **Failed (Refresh)**.
 */
final class GorgiasAPI implements GorgiasClient
{
    /** Mirrors Gorgias's own email validation, so only addresses it accepts key a customer. */
    private const EMAIL_RE = '/^([-!#-\'*+\/-9=?A-Z^-~]+(\.[-!#-\'*+\/-9=?A-Z^-~]+)*'
        . '|"([]!#-[^-~ \t]|(\\\\[\t -~]))+")'
        . '@([-!#-\'*+\/-9=?A-Z^-~]+(\.[-!#-\'*+\/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])$/D';

    /** ShipBob timestamps are UTC; rearranging the digits avoids any timezone conversion. */
    private const ISO_RE = '/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/';

    public readonly string $apiUrl;

    private readonly ClientInterface $http;

    private readonly LoggerInterface $logger;

    /** $handler and $retryDelayMs let tests send through a mock handler without sleeping. */
    public function __construct(Pandium $pandium, ?callable $handler = null, int $retryDelayMs = 2000)
    {
        $token = $pandium->secrets['gorgias_oauth_access_token'] ?? '';
        $account = $pandium->secrets['gorgias_oauth_account'] ?? '';
        if ($token === '' || $account === '') {
            throw new RuntimeException(
                'PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN and PAN_SEC_GORGIAS_OAUTH_ACCOUNT are required'
            );
        }

        $this->logger = Log::get('gorgias');
        $this->apiUrl = 'https://' . strtolower($account) . '.gorgias.com/api';

        // The connector reports the token scheme alongside the token.
        $tokenType = $pandium->secrets['gorgias_oauth_token_type'] ?? 'Bearer';
        $this->http = Http::client([
            'accept' => 'application/json',
            'content-type' => 'application/json',
            'Authorization' => "{$tokenType} {$token}",
        ], $retryDelayMs, $handler);
    }

    // --- customers (cron flow) -------------------------------------------------

    /** The full customer record for this email or external_id, or null if none. */
    public function findCustomer(?string $email = null, ?string $externalId = null): ?array
    {
        $this->logger->info("looking for gorgias customer: {$email}, {$externalId}");
        if ($email !== null && $email !== '') {
            $query = ['email' => strtolower($email)];
        } elseif ($externalId !== null && $externalId !== '') {
            $query = ['external_id' => $externalId];
        } else {
            return null;
        }

        $res = $this->http->request('GET', "{$this->apiUrl}/customers", ['query' => $query]);
        $rows = $this->decode($res)['data'] ?? [];
        if ($rows === []) {
            $this->logger->info('Customer not found');

            return null;
        }

        $detail = $this->http->request('GET', "{$this->apiUrl}/customers/{$rows[0]['id']}");
        $this->logger->info('Customer found');

        return $this->decode($detail);
    }

    public function createCustomer(array $payload): int
    {
        $this->logger->info('creating new gorgias customer');
        try {
            $res = $this->http->request('POST', "{$this->apiUrl}/customers", ['json' => $payload]);
        } catch (Throwable $e) {
            $this->logger->error('Create customer failed: ' . self::responseBody($e));

            throw $e;
        }
        $this->logger->info('Customer created successfully');

        return (int) $this->decode($res)['id'];
    }

    public function updateCustomer(int $customerId, array $payload): void
    {
        $this->logger->info("updating gorgias customer {$customerId}");
        try {
            $this->http->request('PUT', "{$this->apiUrl}/customers/{$customerId}", ['json' => $payload]);
        } catch (Throwable $e) {
            $this->logger->error("Update customer {$customerId} failed: " . self::responseBody($e));

            throw $e;
        }
        $this->logger->info('customer updated');
    }

    // --- tickets (webhook flow) ---------------------------------------------------

    public function createTicket(array $payload): array
    {
        $this->logger->info('creating gorgias ticket');
        try {
            $res = $this->http->request('POST', "{$this->apiUrl}/tickets", ['json' => $payload]);
        } catch (Throwable $e) {
            $this->logger->error('Create ticket failed: ' . self::responseBody($e));

            throw $e;
        }

        return $this->decode($res);
    }

    // --- helpers ------------------------------------------------------------

    public function validEmail(?string $email): string
    {
        if ($email !== null && $email !== '' && !str_contains($email, '.@') && preg_match(self::EMAIL_RE, $email)) {
            return $email;
        }

        return '';
    }

    /**
     * The key identifying an order's customer: a valid recipient email when present,
     * otherwise a synthetic `name address1 city country`. Both flows use it.
     *
     * @param array<string, mixed> $sbOrder
     */
    public function customerKey(array $sbOrder): string
    {
        $email = $this->validEmail($sbOrder['recipient']['email'] ?? null);
        if ($email !== '') {
            return $email;
        }
        $address = $sbOrder['recipient']['address'] ?? [];

        return implode(' ', [
            $sbOrder['recipient']['name'] ?? '',
            $address['address1'] ?? '',
            $address['city'] ?? '',
            $address['country'] ?? '',
        ]);
    }

    /** Body for POST /customers when the customer does not yet exist. */
    public function newCustomerPayload(array $sbOrder, string $key): array
    {
        $payload = [
            'name' => $sbOrder['recipient']['name'] ?? '',
            'external_id' => $key,
            'data' => ['pandium' => ['shipbob_orders' => []]],
        ];
        $email = $this->validEmail($sbOrder['recipient']['email'] ?? null);
        if ($email !== '') {
            $payload['email'] = $email;
        }

        return $payload;
    }

    /** The single order entry stored in `data.pandium.shipbob_orders`. */
    public function orderDataPayload(array $sbOrder): array
    {
        $shipments = $sbOrder['shipments'] ?? [];
        foreach ($shipments as &$shipment) {
            foreach (['estimated_fulfillment_date', 'actual_fulfillment_date'] as $field) {
                if (!empty($shipment[$field])) {
                    $shipment[$field] = self::formatDate($shipment[$field]);
                }
            }
            $shipment['url'] = 'https://web.shipbob.com/App/Merchant/#/Orders/'
                . ($shipment['id'] ?? '') . '/';
        }
        unset($shipment); // break the reference the loop leaves behind

        return [
            'id' => $sbOrder['id'] ?? '',
            'created_date' => self::formatDate($sbOrder['created_date'] ?? ''),
            'purchase_date' => self::formatDate($sbOrder['purchase_date'] ?? ''),
            'reference_id' => $sbOrder['reference_id'] ?? '',
            'order_number' => $sbOrder['order_number'] ?? '',
            'status' => $sbOrder['status'] ?? '',
            'type' => $sbOrder['type'] ?? '',
            'channel' => $sbOrder['channel'] ?? new stdClass(),
            'shipping_method' => $sbOrder['shipping_method'] ?? '',
            'recipient' => $sbOrder['recipient'] ?? new stdClass(),
            'products' => $sbOrder['products'] ?? [],
            'tags' => $sbOrder['tags'] ?? [],
            'shipments' => $shipments,
        ];
    }

    /** Render a ShipBob ISO timestamp for the sidebar; pass through anything unparseable. */
    public static function formatDate(string $value): string
    {
        if ($value === '' || !preg_match(self::ISO_RE, $value, $m)) {
            return $value;
        }
        [, $year, $month, $day, $hour, $minute, $second] = $m;

        return "{$day}/{$month}/{$year} {$hour}:{$minute}:{$second} UTC";
    }

    /** @return array<string, mixed> */
    private function decode(ResponseInterface $res): array
    {
        return json_decode((string) $res->getBody(), true, 512, JSON_THROW_ON_ERROR) ?? [];
    }

    /** The response body of a rejected write, where Gorgias puts its validation errors. */
    private static function responseBody(Throwable $e): string
    {
        return $e instanceof RequestException && $e->getResponse() !== null
            ? (string) $e->getResponse()->getBody()
            : $e->getMessage();
    }
}
