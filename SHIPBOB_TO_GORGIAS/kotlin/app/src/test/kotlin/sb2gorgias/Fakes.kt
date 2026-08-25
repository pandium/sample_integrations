package sb2gorgias

import java.time.LocalDateTime
import java.util.concurrent.atomic.AtomicReference
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.addJsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray
import kotlinx.serialization.json.putJsonObject

/**
 * Test doubles and payload factories shared by the tests. Nothing here touches the
 * network, the filesystem, or the environment.
 *
 * The doubles implement the same [Orders] and [Helpdesk] interfaces the real clients do,
 * so the flows under test run their real logic — only the API calls at the edges are
 * swapped for in-memory recorders.
 */

// --- ShipBob ------------------------------------------------------------------

/**
 * Serves canned pages of orders and records which pages were asked for. Each half keeps
 * its own page log, so asserting on one half's paging does not pick up the other's single
 * empty page.
 */
class FakeShipBob(
    private val newPages: List<List<JsonElement>> = emptyList(),
    private val updatedPages: List<List<JsonElement>> = emptyList(),
    /**
     * A page that throws instead of answering, standing in for a ShipBob the HTTP
     * client's retries could not get a page out of.
     */
    private val failingPage: Int? = null,
) : Orders {
    val newPagesRequested = mutableListOf<Int>()
    val updatedPagesRequested = mutableListOf<Int>()

    /** The live cursor, when a test wants to see where it stood mid-sync. */
    var watched: AtomicReference<Cursors>? = null

    /**
     * Where each cursor stood as each page was fetched — which is what the deadline
     * watchdog would have flushed at that moment.
     */
    val newCursorWhenFetched = mutableMapOf<Int, LocalDateTime>()
    val updatedCursorWhenFetched = mutableMapOf<Int, LocalDateTime>()

    override fun newOrdersPage(startDate: LocalDateTime, page: Int): List<JsonElement> {
        newPagesRequested += page
        watched?.let { newCursorWhenFetched[page] = it.get().newOrders }
        return pageOf(newPages, page)
    }

    override fun updatedOrdersPage(startDate: LocalDateTime, page: Int): List<JsonElement> {
        updatedPagesRequested += page
        watched?.let { updatedCursorWhenFetched[page] = it.get().updatedOrders }
        return pageOf(updatedPages, page)
    }

    private fun pageOf(pages: List<List<JsonElement>>, page: Int): List<JsonElement> {
        check(page != failingPage) { "ShipBob is unavailable (page $page)" }
        return pages.getOrElse(page - 1) { emptyList() }
    }
}

// --- Gorgias ------------------------------------------------------------------

/**
 * A [Helpdesk] that keeps every call in memory. [known] names customers that already
 * exist; they are found at ids 40, 41, and so on.
 */
class RecordingGorgias(known: List<String> = emptyList()) : Helpdesk {
    private val customers = known.withIndex().associate { (offset, key) -> key to 40L + offset }.toMutableMap()

    val created = mutableListOf<JsonObject>()
    val updated = mutableListOf<Pair<Long, JsonObject>>()
    val tickets = mutableListOf<JsonObject>()

    override fun findCustomer(key: CustomerKey): JsonObject? =
        customers[key.value]?.let { id ->
            buildJsonObject {
                put("id", id)
                putJsonObject("data") { putJsonObject("pandium") { putJsonArray("shipbob_orders") {} } }
            }
        }

    override fun createCustomer(payload: JsonObject): Long {
        val id = 1000L + created.size
        payload["external_id"].string?.let { customers[it] = id }
        created += payload
        return id
    }

    override fun updateCustomer(id: Long, payload: JsonObject) {
        updated += id to payload
    }

    override fun createTicket(payload: JsonObject): JsonElement {
        tickets += payload
        return buildJsonObject { put("id", 900L + tickets.size) }
    }
}

// --- payload factories ---------------------------------------------------------

/** A ShipBob order as the cron flow sees it. */
fun order(id: Long, created: String, email: String?): JsonObject = buildJsonObject {
    put("id", id)
    put("created_date", created)
    put("reference_id", "REF-$id")
    putJsonObject("recipient") {
        put("name", "Buyer")
        put("email", email)
        putJsonObject("address") {
            put("address1", "1 Main St")
            put("city", "NY")
            put("country", "US")
        }
    }
    putJsonArray("shipments") {
        addJsonObject {
            put("id", id * 10)
            put("last_update_at", created)
        }
    }
}

/**
 * The same order, with its shipment updated at a different time than it was created —
 * which is what the updated-orders cursor keys off.
 */
fun orderUpdatedOn(id: Long, updated: String, email: String): JsonObject =
    buildJsonObject {
        order(id, "2026-07-01T00:00:00Z", email).forEach { (key, value) ->
            if (key != "shipments") put(key, value)
        }
        putJsonArray("shipments") {
            addJsonObject {
                put("id", id * 10)
                put("last_update_at", updated)
            }
        }
    }

/**
 * A ShipBob shipment webhook body. Every order-related topic delivers this same object;
 * `status` and `status_details` are what vary between them.
 */
fun shipmentEvent(shipmentId: Long, status: String): JsonObject = buildJsonObject {
    put("id", shipmentId)
    put("order_id", 289012345L)
    put("reference_id", "MERCHANT-ORDER-1001")
    put("status", status)
    putJsonArray("status_details") {}
    putJsonObject("tracking") {
        put("carrier", "USPS")
        put("tracking_number", "9400100000000000000000")
    }
    put("delivery_date", "2026-07-09T18:22:00Z")
    putJsonArray("products") {
        addJsonObject {
            put("name", "Pinnacle Shampoo")
            put("sku", "PIN-100")
            putJsonArray("inventory_items") {
                addJsonObject {
                    put("name", "Pinnacle Shampoo")
                    put("quantity", 4)
                }
            }
        }
    }
    putJsonObject("recipient") {
        put("name", "Jane Buyer")
        put("email", "jane@example.com")
        putJsonObject("address") {
            put("address1", "100 Nowhere Blvd")
            put("city", "Gotham City")
            put("country", "US")
        }
    }
}

/**
 * The harder shape: status details, no tracking, and no recipient email — the one that
 * exercises the synthetic `external_id` customer path.
 */
fun onholdEvent(): JsonObject = buildJsonObject {
    val replaced = setOf("status_details", "tracking", "delivery_date", "recipient")
    shipmentEvent(107414278L, "OnHold").forEach { (key, value) -> if (key !in replaced) put(key, value) }
    putJsonArray("status_details") {
        addJsonObject {
            put("id", 401)
            put("name", "InvalidAddress")
            put("description", "Invalid Address")
        }
        addJsonObject {
            put("id", 400)
            put("name", "PaymentDeclined")
            put("description", "Payment Failure")
        }
    }
    put("tracking", JsonNull)
    put("delivery_date", JsonNull)
    putJsonObject("recipient") {
        put("name", "Jane Buyer")
        put("email", JsonNull)
        putJsonObject("address") {
            put("address1", "100 Nowhere Blvd")
            put("city", "Gotham City")
            put("country", "US")
        }
    }
}

/**
 * An event wrapped the way Pandium hands one to a run. The real thing arrives as a file
 * path, which [Pandium.webhookDeliveries] has already read back.
 */
fun delivery(id: String, event: JsonObject): WebhookDelivery = WebhookDelivery(id, event.toString())
