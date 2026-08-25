import io.github.oshai.kotlinlogging.KotlinLogging
import kotlin.random.Random
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.add
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray

private val logger = KotlinLogging.logger {}

/** The business logic of the run varies depending on the run mode. */
fun run(mode: String?, pandium: Pandium): JsonElement =
    when (mode) {
        // Init mode: report which secrets are available and populate tenant metadata with
        // the dynamic config values needed for the customer-facing config form. In the real
        // world, these values would be derived from an api call.
        "init" -> {
            logger.info { "The available secrets are: ${pandium.secrets.keys.joinToString(", ")}" }
            buildJsonObject {
                putJsonArray("dynamic_colors") {
                    listOf("red", "green", "purple", "orange", "yellow").forEach { add(it) }
                }
            }
        }

        // Webhook mode: log each trigger's headers and body. This version emits no metadata,
        // but there is no reason not to update metadata from here.
        "webhook" -> {
            pandium.webhookPayloads().forEach { payload ->
                logger.info { "headers: ${payload.headers}" }
                logger.info { "body: ${payload.body}" }
            }
            JsonObject(emptyMap())
        }

        // Normal mode: log the config, then log the previous normal run's random number and
        // store a fresh random number as metadata.
        else -> {
            logger.info { "Tenant configs: ${pandium.config}" }
            val newRandomNumber = Random.nextInt(1_000_000)
            pandium.metadata?.let { previous ->
                logger.info { "last run's random number: ${previous.jsonObject["random_number"]}" }
            }
            logger.info { "new random number: $newRandomNumber" }
            buildJsonObject { put("random_number", newRandomNumber) }
        }
    }

fun main() {
    val pandium = Pandium.fromEnv()

    logger.info { "Hello from a Pandium integration, written in Kotlin!" }
    logger.info { "This run is in mode: ${pandium.runMode}" }

    pandium.updateMetadata(run(pandium.runMode, pandium))
}
