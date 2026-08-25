import io.github.cdimascio.dotenv.Dotenv
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.File
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonPrimitive

private val logger = KotlinLogging.logger {}

/**
 * A single webhook trigger's headers and parsed body. Kept as separate fields (rather than
 * one combined element) so callers can log each on its own line.
 */
data class WebhookPayload(val headers: JsonElement?, val body: JsonElement)

/**
 * Everything Pandium hands to an integration at runtime. `config` (`PAN_CFG_*`) and
 * `secrets` (`PAN_SEC_*`) hold arbitrary keys defined per integration and are exposed as
 * plain maps. `context` (`PAN_CTX_*`) is controlled by Pandium, so its values are surfaced
 * through named properties.
 */
class Pandium private constructor(
    val config: Map<String, String>,
    val secrets: Map<String, String>,
    private val context: Map<String, String>,
) {
    /** The run mode for this invocation (e.g. `init`, `webhook`). */
    val runMode: String?
        get() = context["run_mode"]

    /**
     * The triggers that caused this run, parsed from JSON. Relevant for webhook
     * invocations, where each trigger's `payload.file` names a file holding the raw webhook
     * body.
     */
    val runTriggers: List<JsonElement>
        get() {
            val raw = context["run_triggers"] ?: return emptyList()
            return runCatching { Json.parseToJsonElement(raw).jsonArray }
                .onFailure { logger.error { "could not parse run triggers as JSON: $raw: $it" } }
                .getOrDefault(emptyList())
        }

    /** The tenant metadata persisted by the previous run, parsed as JSON. */
    val metadata: JsonElement? by lazy {
        val filename = context["tenant_metadata_file"] ?: return@lazy null
        runCatching { Json.parseToJsonElement(File(filename).readText()) }
            .onFailure { logger.error { "could not read tenant metadata from $filename: $it" } }
            .getOrNull()
    }

    /**
     * The webhook payloads for this run: each trigger's headers and parsed body, read from
     * the file its `payload.file` names. Relevant for webhook invocations.
     */
    fun webhookPayloads(): List<WebhookPayload> =
        runTriggers.mapNotNull { trigger ->
            val fields = trigger as? JsonObject ?: return@mapNotNull null
            if (fields["mode"]?.jsonPrimitive?.contentOrNull != "webhook") return@mapNotNull null
            val payload = fields["payload"] as? JsonObject ?: return@mapNotNull null
            val file = payload["file"]?.jsonPrimitive?.contentOrNull ?: return@mapNotNull null
            runCatching { WebhookPayload(payload["headers"], Json.parseToJsonElement(File(file).readText())) }
                .onFailure { logger.error { "could not read webhook payload $file: $it" } }
                .getOrNull()
        }

    /**
     * Merge `metadata` into the tenant metadata that the next run reads back. Pandium reads
     * the last non-empty line of stdout as the metadata, so anything printed to stdout
     * after this call replaces it.
     */
    fun updateMetadata(metadata: JsonElement) {
        logger.info { "updating metadata with $metadata" }
        println(metadata)
    }

    companion object {
        private val dotenv: Dotenv by lazy { Dotenv.configure().ignoreIfMissing().load() }

        /**
         * Collect environment variables starting with `prefix`, stripping the prefix and
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
