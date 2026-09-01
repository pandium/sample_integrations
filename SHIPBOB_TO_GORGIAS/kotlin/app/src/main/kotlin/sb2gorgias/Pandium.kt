package sb2gorgias

import io.github.cdimascio.dotenv.Dotenv
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.File
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement

private val logger = KotlinLogging.logger {}

/**
 * One webhook delivery handed to this run: the raw request body, plus the trigger
 * [id], which is useful for correlating with the run log.
 */
data class WebhookDelivery(val id: String, val body: String)

/**
 * The Pandium runtime contract.
 *
 * Everything Pandium hands to an integration arrives as an environment variable.
 * `PAN_CFG_*` ([config]) and `PAN_SEC_*` ([secrets]) hold keys defined per integration, so
 * they are plain maps. `PAN_CTX_*` (the run context) is controlled by Pandium, so it gets
 * named, typed properties instead.
 */
class Pandium(
    val config: Map<String, String>,
    val secrets: Map<String, String>,
    private val context: Map<String, String>,
) {
    /** A boolean config: every config reaches the run as text, so a ticked box is `"true"`. */
    fun flag(key: String): Boolean = config[key].equals("true", ignoreCase = true)

    /**
     * A secret the integration cannot run without. The message names the environment
     * variable, so a misconfigured connector shows up in the run log rather than as a 401.
     */
    fun requireSecret(key: String): String =
        checkNotNull(secrets[key]?.takeIf(String::isNotBlank)) { "PAN_SEC_${key.uppercase()} is required" }

    /** The run mode for this invocation: `init`, `normal`, or `webhook`. */
    val runMode: String?
        get() = context["run_mode"]

    /** The triggers that caused this run, parsed from JSON. */
    val runTriggers: List<JsonElement>
        get() {
            val raw = context["run_triggers"] ?: return emptyList()
            return runCatching { json.parseToJsonElement(raw) as JsonArray }
                .onFailure { logger.error { "could not parse run triggers as JSON: $raw: $it" } }
                .getOrDefault(JsonArray(emptyList()))
        }

    /**
     * Tenant metadata, typically persisted by the previous run. Missing or unreadable
     * metadata comes back as `null`, which the `Json.kt` accessors index like an empty
     * object.
     */
    val metadata: JsonElement? by lazy {
        val filename = context["tenant_metadata_file"] ?: return@lazy null
        runCatching { json.parseToJsonElement(File(filename).readText()) }
            .onFailure { logger.error { "could not read tenant metadata from $filename: $it" } }
            .getOrNull()
    }

    /**
     * The webhook deliveries bundled into this run.
     *
     * Pandium debounces triggers per tenant, so a webhook run carries N of these, not one.
     * Each raw request body is written to disk and named by its trigger; this reads them.
     */
    fun webhookDeliveries(): List<WebhookDelivery> =
        runTriggers.filter { it["source"].string == "webhook" }.mapNotNull { trigger ->
            val id = trigger["id"].string.orEmpty()
            val file = trigger["payload"]["file"].string
            if (file == null) {
                logger.warn { "webhook trigger $id has no payload file" }
                return@mapNotNull null
            }
            runCatching { WebhookDelivery(id, File(file).readText()) }
                .onFailure { logger.error { "could not read webhook payload $file: $it" } }
                .getOrNull()
        }

    companion object {
        /** A local `.env` when there is one. On Pandium there is not, and this is a no-op. */
        private val dotenv: Dotenv by lazy { Dotenv.configure().ignoreIfMissing().load() }

        /**
         * Collect environment variables starting with [prefix], stripping the prefix and
         * lower-casing the remaining key.
         */
        private fun entriesWithPrefix(prefix: String): Map<String, String> =
            dotenv.entries()
                .filter { it.key.startsWith(prefix) }
                .associate { it.key.removePrefix(prefix).lowercase() to it.value }

        fun fromEnv(): Pandium =
            Pandium(
                config = entriesWithPrefix("PAN_CFG_"),
                secrets = entriesWithPrefix("PAN_SEC_"),
                context = entriesWithPrefix("PAN_CTX_"),
            )
    }
}

/**
 * Merge [metadata] into the tenant metadata for the next run to read back.
 *
 * Pandium shallow-merges the last line of stdout into the tenant's stored metadata, so this
 * is the only thing a run writes to stdout — logs go to stderr (see `logback.xml`).
 */
fun updateMetadata(metadata: JsonElement) {
    logger.info { "updating metadata with $metadata" }
    println(metadata)
}
