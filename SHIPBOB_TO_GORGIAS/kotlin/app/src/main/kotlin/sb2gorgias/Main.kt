package sb2gorgias

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlin.system.exitProcess

private val logger = KotlinLogging.logger {}

/**
 * Both flows ship in one jar and are selected by Pandium's run mode.
 *
 * `Pandium.kt` is the file to read first. It is the whole platform contract in a single
 * file: `PAN_CFG_*` and `PAN_SEC_*` as plain maps, `PAN_CTX_*` as named properties, the
 * metadata file read, and the single stdout write that hands metadata back to Pandium.
 */
fun main() {
    val pandium = Pandium.fromEnv()
    val mode = pandium.runMode ?: "normal"
    logger.info { "syncing ShipBob to Gorgias; this run is in mode: $mode" }

    val metadata =
        try {
            when (mode) {
                // Webhook mode: ShipBob order webhook deliveries become a Gorgias ticket
                // per new shipment status.
                "webhook" -> runWebhookFlow(pandium)

                // Normal mode: the scheduled ShipBob orders -> Gorgias customer sync.
                else -> runCronFlow(pandium)
            }
        } catch (e: Exception) {
            // Exit non-zero with nothing on stdout, which leaves the tenant's stored
            // metadata exactly as the last successful run left it.
            logger.error(e) { "the run failed; leaving tenant metadata untouched" }
            exitProcess(1)
        }

    updateMetadata(metadata)
}
