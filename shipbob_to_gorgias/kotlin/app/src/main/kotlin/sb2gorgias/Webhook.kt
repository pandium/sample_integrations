package sb2gorgias

import io.github.oshai.kotlinlogging.KotlinLogging
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.addJsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray

private val logger = KotlinLogging.logger {}

/**
 * The webhook flow: any ShipBob order webhook → a Gorgias ticket.
 *
 * A run may carry N debounced deliveries, so the flow loops over every one. Creating a
 * ticket is not idempotent and ShipBob retries any delivery that does not get a 2xx, so
 * deliveries are deduped on `shipment_id:status` in a `processed_events` map in tenant
 * metadata, pruned to a 30-minute window. Keying on the status as well as the shipment lets
 * a redelivery be dropped while the shipment's genuine *next* status still opens a ticket.
 *
 * Pandium verifies each delivery's signature before it reaches a run, so the bodies handled
 * here are already known to have come from ShipBob.
 */

/** How long a handled event is remembered: past ShipBob's retries, short enough to stay small. */
private const val PRUNE_WINDOW_MINUTES = 30L

/** Goes on every ticket this flow opens, so they can all be found at once. */
private const val SHIPMENT_TAG = "shipbob-shipment"

fun runWebhookFlow(pandium: Pandium): JsonObject {
    val now = OffsetDateTime.now(ZoneOffset.UTC)
    val processed = prune(pandium.metadata["processed_events"], now.toLocalDateTime())

    process(pandium.webhookDeliveries(), Gorgias(pandium), processed, now)

    return buildJsonObject { put("processed_events", JsonObject(processed)) }
}

/**
 * Open a ticket for every delivery that has not been ticketed already, marking each one
 * handled in [processed] as it goes. Split out from [runWebhookFlow] for test doubles.
 */
fun process(
    deliveries: List<WebhookDelivery>,
    gorgias: Helpdesk,
    processed: MutableMap<String, JsonElement>,
    now: OffsetDateTime,
) {
    val ticketedAt = JsonPrimitive(now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
    var opened = 0

    for (delivery in deliveries) {
        val event =
            runCatching { json.decodeFromString<Shipment>(delivery.body) }
                .onFailure { logger.error { "webhook delivery ${delivery.id} is not a shipment: $it" } }
                .getOrNull() ?: continue

        val shipmentId = event.id
        if (shipmentId == null) {
            logger.warn { "webhook delivery ${delivery.id} has no shipment id" }
            continue
        }

        // Every order webhook gets a ticket, whatever the status: the status is part of the
        // dedupe key, never a filter.
        val status = event.reportedStatus
        val eventKey = "$shipmentId:$status"
        if (eventKey in processed) {
            logger.info { "shipment $shipmentId is already ticketed as $status; skipping" }
            continue
        }

        val customerId =
            try {
                resolveCustomer(gorgias, event)
            } catch (e: Exception) {
                // Left unprocessed on purpose, so ShipBob's retry gets another go.
                logger.error(e) { "no Gorgias customer for shipment $shipmentId" }
                continue
            }

        try {
            val ticket = gorgias.createTicket(buildTicket(event, customerId))
            logger.info { "opened Gorgias ticket ${ticket["id"]} for shipment $shipmentId ($status)" }
            processed[eventKey] = ticketedAt
            opened++
        } catch (e: Exception) {
            logger.error(e) { "failed to open a ticket for $shipmentId" }
        }
    }

    logger.info { "webhook flow: opened $opened ticket(s); tracking ${processed.size} event(s)" }
}

/** Drop entries older than [PRUNE_WINDOW_MINUTES], or too mangled to date. */
fun prune(processed: JsonElement?, now: LocalDateTime): MutableMap<String, JsonElement> {
    val cutoff = now.minusMinutes(PRUNE_WINDOW_MINUTES)
    // No metadata yet means nothing has been ticketed.
    return processed.obj.orEmpty()
        .filterValues { ticketedAt -> parseTimestamp(ticketedAt.string)?.let { it >= cutoff } == true }
        .toMutableMap()
}

/**
 * Find-or-create the Gorgias customer for a shipment's recipient. Uses the same key the
 * cron flow does, so the ticket lands on the record carrying the customer's order history.
 */
private fun resolveCustomer(gorgias: Helpdesk, event: Shipment): Long {
    val key = CustomerKey.forRecipient(event.recipient)
    return when (val found = gorgias.findCustomer(key)) {
        null -> gorgias.createCustomer(newCustomerPayload(event.recipient, key))
        else -> checkNotNull(found["id"].long) { "customer has no id" }
    }
}

/**
 * The `POST /tickets` payload for a shipment webhook of any status.
 *
 * Only the parts ShipBob actually sent for this status make it into the body — an OnHold
 * shipment has no tracking, a Delivered one has no status details — which is why [Shipment]
 * models those fields as nullable and this walks them one at a time.
 */
fun buildTicket(event: Shipment, customerId: Long): JsonObject {
    val shipmentId = event.id ?: 0
    val reference = event.orderReference
    val status = event.reportedStatus
    val headline = "Shipment $shipmentId for order $reference is now $status."

    val text = mutableListOf(headline)
    val html = mutableListOf("<p>$headline</p>")

    val reasons = event.statusDetails.mapNotNull { it.description ?: it.name }.joinToString("; ")
    if (reasons.isNotEmpty()) {
        text += "Reason: $reasons"
        html += "<p><b>Reason:</b> $reasons</p>"
    }
    event.tracking?.let { tracking ->
        val summary = "${tracking.carrier.orEmpty()} ${tracking.trackingNumber.orEmpty()}".trim()
        if (summary.isNotEmpty()) {
            text += "Tracking: $summary"
            html += "<p><b>Tracking:</b> $summary</p>"
        }
    }
    event.deliveredOn?.let { text += "Delivered on: $it" }
    val items = event.products.map(::itemLine)
    if (items.isNotEmpty()) {
        text += items.joinToString("\n", prefix = "Items:\n")
        html += items.joinToString("", prefix = "<ul>", postfix = "</ul>") { "<li>$it</li>" }
    }

    // Gorgias wants the customer twice: as the ticket's owner and as the sender of its
    // first message.
    val customer = buildJsonObject { put("id", customerId) }
    return buildJsonObject {
        put("customer", customer)
        put("channel", "api")
        put("via", "api")
        put("from_agent", false)
        put("status", "open")
        putJsonArray("messages") {
            addJsonObject {
                put("sender", customer)
                put("channel", "api")
                put("via", "api")
                put("from_agent", false)
                put("subject", "Order $reference: shipment $status")
                put("body_text", text.joinToString("\n"))
                put("body_html", html.joinToString(""))
                // Included so Gorgias auto-reply and keyword rules can fire.
                put("stripped_text", headline)
            }
        }
        // A constant tag plus the status, so Gorgias rules can route without parsing the body.
        putJsonArray("tags") {
            addJsonObject { put("name", SHIPMENT_TAG) }
            addJsonObject { put("name", "shipbob-${status.lowercase().replace(' ', '-')}") }
        }
    }
}

/** One line per product on the shipment: `4 x 16 oz. Shampoo (PIN-100)`. */
private fun itemLine(product: Product): String {
    val quantity = product.inventoryItems.sumOf { it.quantity ?: 0 }
    val name = product.name.orEmpty()
    val sku = product.sku?.takeIf(String::isNotBlank) ?: product.referenceId?.takeIf(String::isNotBlank)
    return if (sku == null) "$quantity x $name" else "$quantity x $name ($sku)"
}
