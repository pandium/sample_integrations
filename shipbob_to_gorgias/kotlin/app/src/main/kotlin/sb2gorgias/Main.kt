package sb2gorgias

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlin.system.exitProcess

private val logger = KotlinLogging.logger {}

/**
 * Both flows ship in one jar and are selected by Pandium's run mode.
 *
 * `Pandium.kt` is the file to read first: it holds the whole platform contract — config and
 * secrets, the run context, and the single stdout write that hands metadata back.
 */
fun main() {
    val pandium = Pandium.fromEnv()
    val mode = pandium.runMode ?: "normal"
    logger.info { "syncing ShipBob to Gorgias; this run is in mode: $mode" }

    val metadata =
        try {
            when (mode) {
                // A Gorgias ticket per new shipment status.
                "webhook" -> runWebhookFlow(pandium)

                // The scheduled ShipBob orders -> Gorgias customer sync.
                else -> runCronFlow(pandium)
            }
        } catch (e: Exception) {
            // Exit non-zero with nothing on stdout, leaving the tenant's stored metadata
            // as the last successful run left it.
            logger.error(e) { "the run failed; leaving tenant metadata untouched" }
            exitProcess(1)
        }

    updateMetadata(metadata)
}
