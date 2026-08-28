import * as fs from 'fs'
import log4js from 'log4js'

// stdout is reserved for the final metadata JSON that Pandium reads back, so logs go
// to stderr instead.
log4js.configure({
    appenders: {
        stderr: {
            type: 'stderr',
            layout: { type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss:SSS}] [%c] %p: %m' },
        },
    },
    categories: { default: { appenders: ['stderr'], level: 'info' } },
})
export const logger = log4js.getLogger('lib')

/** Safe nested lookup by dotted path, e.g. `deepGet(order, 'recipient.address.city')`. */
export function deepGet(data, path, defaultValue) {
    let cur = data
    for (const part of path.split('.')) {
        if (cur === null || typeof cur !== 'object') return defaultValue
        cur = cur[part]
    }
    return cur === null || cur === undefined ? defaultValue : cur
}

/** Collect environment variables starting with `prefix`, stripping the prefix and
 * lower-casing the remaining key. */
function fromEnv(prefix) {
    const result = {}
    for (const [key, val] of Object.entries(process.env)) {
        if (key.startsWith(prefix) && val) {
            result[key.slice(prefix.length).toLowerCase()] = val
        }
    }
    return result
}

/**
 * Everything Pandium hands to an integration at runtime. `config` (`PAN_CFG_*`) and
 * `secrets` (`PAN_SEC_*`) hold arbitrary keys defined per integration and are exposed as
 * plain objects. `context` (`PAN_CTX_*`) is controlled by Pandium, so its values are surfaced
 * through named methods.
 */
export class Pandium {
    constructor(config, secrets, context) {
        this.config = config
        this.secrets = secrets
        this.context = context
        this._metadataLoaded = false
        this._metadataCache = undefined
    }

    static fromEnv() {
        return new Pandium(fromEnv('PAN_CFG_'), fromEnv('PAN_SEC_'), fromEnv('PAN_CTX_'))
    }

    /** The run mode for this invocation (e.g. `init`, `webhook`). */
    runMode() {
        return this.context['run_mode']
    }

    /**
     * The triggers that caused this run, parsed from JSON. Relevant for webhook
     * invocations, where each trigger's `payload.file` names a file holding the raw
     * webhook body.
     */
    runTriggers() {
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
     * The webhook payloads for this run: each trigger's id, headers, and parsed body, read
     * from the file its `payload.file` names. Relevant for webhook invocations.
     *
     * Pandium debounces triggers per tenant, so deliveries that arrive while a run is in
     * flight are bundled into the next one — a webhook run carries N of these, not one.
     */
    webhookPayloads() {
        const payloads = []
        for (const trigger of this.runTriggers()) {
            if (!trigger.mode || trigger.mode !== 'webhook') continue
            const file = trigger.payload?.file
            if (!file) {
                logger.error(`webhook trigger ${trigger.id} has no payload file`)
                continue
            }
            try {
                const body = fs.readFileSync(file, 'utf-8')
                payloads.push({
                    id: String(trigger.id ?? ''),
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
    metadata() {
        if (this._metadataLoaded) return this._metadataCache

        this._metadataLoaded = true
        const filename = this.context['tenant_metadata_file']
        if (!filename) return undefined
        try {
            this._metadataCache = JSON.parse(fs.readFileSync(filename, 'utf-8'))
        } catch (err) {
            logger.error(`could not read tenant metadata from ${filename}: ${err}`)
            this._metadataCache = undefined
        }
        return this._metadataCache
    }

    /**
     * Merge `metadata` into the tenant metadata that the next run reads back. Pandium
     * captures stdout and merges it into the stored tenant metadata, so this is the only
     * thing that should be written there.
     */
    updateMetadata(metadata) {
        const json = JSON.stringify(metadata)
        logger.info(`updating metadata with ${json}`)
        console.log(json)
    }
}
