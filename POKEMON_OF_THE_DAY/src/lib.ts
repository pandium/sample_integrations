import * as fs from 'fs'
import log4js from 'log4js'

// stdout is reserved for the final metadata JSON that Pandium reads back, so logs go
// to stderr instead.
log4js.configure({
    appenders: {
        stderr: {
            type: 'stderr',
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss:SSS}] [%c] %p: %m',
            },
        },
    },
    categories: { default: { appenders: ['stderr'], level: 'info' } },
})
export const logger = log4js.getLogger('lib')

export function isTruthy(value: string) {
    return ['true', '1', 't', 'y', 'yes'].includes(value)
}

/** Collect environment variables starting with `prefix`, stripping the prefix and
 * lower-casing the remaining key. */
function fromEnv(prefix: string): { [key: string]: string } {
    const result: { [key: string]: string } = {}
    for (const [key, val] of Object.entries(process.env)) {
        if (key.startsWith(prefix) && val) {
            result[key.slice(prefix.length).toLowerCase()] = val
        }
    }
    return result
}

export interface WebhookPayload {
    body: any
    headers: any
}

interface RunTrigger {
    mode?: string
    payload?: {
        file?: string
        headers?: any
    }
}

/** A tenant's configs, keyed by config name. A key may be absent if never set. */
export type Config = { [key: string]: string | undefined }

/**
 * Everything Pandium hands to an integration at runtime. `config` (`PAN_CFG_*`) and
 * `secrets` (`PAN_SEC_*`) hold arbitrary keys defined per integration and are exposed as
 * plain maps. `context` (`PAN_CTX_*`) is controlled by Pandium, so its values are surfaced
 * through named methods.
 */
export class Pandium {
    config: Config
    secrets: { [key: string]: string }
    private context: { [key: string]: string }
    private metadataCache: any
    private metadataLoaded = false

    private constructor(
        config: Config,
        secrets: { [key: string]: string },
        context: { [key: string]: string }
    ) {
        this.config = config
        this.secrets = secrets
        this.context = context
    }

    static fromEnv(): Pandium {
        return new Pandium(
            fromEnv('PAN_CFG_'),
            fromEnv('PAN_SEC_'),
            fromEnv('PAN_CTX_')
        )
    }

    /** The run mode for this invocation (e.g. `init`, `webhook`). */
    runMode(): string | undefined {
        return this.context['run_mode']
    }

    /**
     * The triggers that caused this run, parsed from JSON. Relevant for webhook
     * invocations, where each trigger's `payload.file` names a file holding the raw
     * webhook body.
     */
    runTriggers(): RunTrigger[] {
        const raw = this.context['run_triggers']
        if (!raw) return []
        try {
            return JSON.parse(raw)
        } catch (err) {
            logger.error(`could not parse run triggers as JSON: ${raw}: ${err}`)
            return []
        }
    }

    /**
     * The webhook payloads for this run: each trigger's headers and parsed body, read
     * from the file its `payload.file` names. Relevant for webhook invocations.
     */
    webhookPayloads(): WebhookPayload[] {
        const payloads: WebhookPayload[] = []
        for (const trigger of this.runTriggers()) {
            if (!trigger.mode || trigger.mode !== 'webhook') continue
            const file = trigger.payload?.file
            if (!file) continue
            try {
                const body = fs.readFileSync(file, 'utf-8')
                payloads.push({
                    headers: trigger.payload?.headers,
                    body: JSON.parse(body),
                })
            } catch (err) {
                logger.error(`could not read webhook payload ${file}: ${err}`)
            }
        }
        return payloads
    }

    /** The tenant metadata persisted by the previous run, parsed as JSON. */
    metadata(): any {
        if (this.metadataLoaded) return this.metadataCache

        this.metadataLoaded = true
        const filename = this.context['tenant_metadata_file']
        if (!filename) return undefined
        try {
            this.metadataCache = JSON.parse(fs.readFileSync(filename, 'utf-8'))
        } catch (err) {
            logger.error(
                `could not read tenant metadata from ${filename}: ${err}`
            )
            this.metadataCache = undefined
        }
        return this.metadataCache
    }

    /**
     * Merge `metadata` into the tenant metadata that the next run reads back. Pandium reads
     * the last non-empty line of stdout as the metadata, so anything printed to stdout
     * after this call replaces it.
     */
    updateMetadata(metadata: any): void {
        const serialized = JSON.stringify(metadata)
        logger.info(`updating metadata with ${serialized}`)
        console.log(serialized)
    }
}
