<?php

declare(strict_types=1);

namespace Pandium\Integration;

use JsonException;
use Psr\Log\LoggerInterface;
use RuntimeException;
use stdClass;
use Throwable;

/**
 * Everything Pandium hands to an integration at runtime: `config` (`PAN_CFG_*`) and
 * `secrets` (`PAN_SEC_*`) are per-integration keys exposed as plain arrays; `context`
 * (`PAN_CTX_*`) is set by Pandium and surfaced through named methods.
 */
final class Pandium
{
    private mixed $metadataCache = null;

    private bool $metadataLoaded = false;

    /**
     * @param array<string, string> $config
     * @param array<string, string> $secrets
     * @param array<string, string> $context
     */
    public function __construct(
        public readonly array $config,
        public readonly array $secrets,
        private readonly array $context,
        private readonly LoggerInterface $logger,
    ) {
    }

    public static function fromEnv(LoggerInterface $logger): self
    {
        return new self(
            self::withPrefix('PAN_CFG_'),
            self::withPrefix('PAN_SEC_'),
            self::withPrefix('PAN_CTX_'),
            $logger,
        );
    }

    /**
     * Environment variables starting with $prefix, with the prefix stripped and the key
     * lowercased.
     *
     * @return array<string, string>
     */
    private static function withPrefix(string $prefix): array
    {
        $items = [];
        foreach (getenv() as $key => $value) {
            if (str_starts_with($key, $prefix)) {
                $items[strtolower(substr($key, strlen($prefix)))] = $value;
            }
        }

        return $items;
    }

    /**
     * A `PAN_CFG_*` checkbox as a bool. Configs arrive as strings, so an unchecked box is
     * the string `'false'`, which PHP would otherwise treat as truthy.
     */
    public function configFlag(string $key): bool
    {
        return strtolower($this->config[$key] ?? '') === 'true';
    }

    /** The run mode for this invocation (e.g. `init`, `webhook`). */
    public function runMode(): ?string
    {
        return $this->context['run_mode'] ?? null;
    }

    /**
     * The triggers that caused this run, parsed from JSON.
     *
     * @return list<array<string, mixed>>
     */
    public function runTriggers(): array
    {
        $raw = $this->context['run_triggers'] ?? '';
        if ($raw === '') {
            return [];
        }

        try {
            return json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            $this->logger->error("could not parse run triggers as JSON: {$raw}: {$e->getMessage()}");

            return [];
        }
    }

    /**
     * The webhook deliveries bundled into this run. Pandium debounces triggers per tenant,
     * so one run may carry several; each trigger's `payload.file` names the raw body
     * Pandium wrote to disk, read back and parsed here.
     *
     * @return list<array{id: string, headers: mixed, body: mixed}>
     */
    public function webhookPayloads(): array
    {
        $payloads = [];
        foreach ($this->runTriggers() as $trigger) {
            if (($trigger['source'] ?? null) !== 'webhook') {
                continue;
            }
            $id = (string) ($trigger['id'] ?? '');
            $file = $trigger['payload']['file'] ?? null;
            if ($file === null) {
                $this->logger->warning("webhook trigger {$id} has no payload file");

                continue;
            }
            try {
                $payloads[] = [
                    'id' => $id,
                    'headers' => $trigger['payload']['headers'] ?? null,
                    'body' => self::readJsonFile($file),
                ];
            } catch (Throwable $e) {
                $this->logger->error("could not read webhook payload {$file}: {$e->getMessage()}");
            }
        }

        return $payloads;
    }

    /** The tenant metadata persisted by the previous run, parsed as JSON. */
    public function metadata(): mixed
    {
        if ($this->metadataLoaded) {
            return $this->metadataCache;
        }

        $this->metadataLoaded = true;
        $filename = $this->context['tenant_metadata_file'] ?? null;
        if ($filename === null) {
            return null;
        }

        try {
            $this->metadataCache = self::readJsonFile($filename);
        } catch (Throwable $e) {
            $this->logger->error("could not read tenant metadata from {$filename}: {$e->getMessage()}");
        }

        return $this->metadataCache;
    }

    /**
     * Merge $metadata into the tenant metadata the next run reads back. Pandium takes the
     * last non-empty line of stdout as the metadata, so nothing else may print there.
     */
    public function updateMetadata(array|object $metadata): void
    {
        // Tenant metadata is always a JSON object, but PHP encodes an empty array as `[]`.
        $json = json_encode($metadata ?: new stdClass(), JSON_THROW_ON_ERROR);
        $this->logger->info("updating metadata with {$json}");
        echo $json, PHP_EOL;
    }

    /** Read and decode a JSON file, throwing if it cannot be read or parsed. */
    private static function readJsonFile(string $filename): mixed
    {
        $raw = @file_get_contents($filename);
        if ($raw === false) {
            throw new RuntimeException('file could not be read');
        }

        return json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    }
}
