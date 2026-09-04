@file:OptIn(ExperimentalSerializationApi::class)

package sb2gorgias

import io.github.oshai.kotlinlogging.KotlinLogging
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.Base64
import kotlin.time.Duration.Companion.seconds
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNames
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.decodeFromJsonElement

private val logger = KotlinLogging.logger {}

/** ShipBob issues tokens from a different auth host per environment. */
private val AUTH_URL_TO_BASE_URL =
    mapOf(
        "https://authstage.shipbob.com" to "https://sandbox-api.shipbob.com/2026-01",
        "https://auth.shipbob.com" to "https://api.shipbob.com/2026-01",
    )

const val DEFAULT_BASE_URL = "https://api.shipbob.com/2026-01"

/** Decode the JWT payload and map its `iss` claim to an API base URL. */
fun resolveBaseUrl(token: String): String {
    val issuer =
        runCatching {
            val payload = token.split('.').getOrNull(1).orEmpty()
            json.parseToJsonElement(String(Base64.getUrlDecoder().decode(payload)))["iss"].string
        }
            .onFailure { logger.warn { "could not resolve ShipBob base URL from token: $it" } }
            .getOrNull()
    return AUTH_URL_TO_BASE_URL[issuer] ?: DEFAULT_BASE_URL
}

// --- the shapes this integration reads ---------------------------------------
//
// A webhook body is small and every field drives a decision, so it gets real types
// ([Shipment]) and the compiler checks the field-presence logic. An order is mostly
// passed through to the Gorgias sidebar unread, so it stays a raw [JsonElement] and only
// the parts the integration acts on are pulled out.

/** Who the order or shipment is going to. Both flows key their Gorgias customer off this. */
@Serializable
data class Recipient(
    val name: String? = null,
    val email: String? = null,
    val address: Address = Address(),
) {
    companion object {
        /** Read the recipient off a raw ShipBob order, which is otherwise left untyped. */
        fun of(order: JsonElement?): Recipient =
            order["recipient"]
                ?.let { runCatching { json.decodeFromJsonElement<Recipient>(it) }.getOrNull() }
                ?: Recipient()
    }
}

@Serializable
data class Address(
    val address1: String? = null,
    val city: String? = null,
    val country: String? = null,
)

/**
 * ShipBob sends a shipment on every order-related webhook topic.
 *
 * `order_shipped`, `shipment_delivered`, `shipment_exception`, `shipment_onhold`, and
 * `shipment_cancelled` all deliver this same object and differ only in [status] and
 * [statusDetails].
 */
@Serializable
data class Shipment(
    /** ShipBob names this `id` on the webhook body; some topics call it `shipment_id`. */
    @JsonNames("shipment_id") val id: Long? = null,
    val orderId: Long? = null,
    val referenceId: String? = null,
    val status: String? = null,
    val statusDetails: List<StatusDetail> = emptyList(),
    val tracking: Tracking? = null,
    val deliveryDate: String? = null,
    val products: List<Product> = emptyList(),
    val recipient: Recipient = Recipient(),
) {
    val reportedStatus: String
        get() = status?.takeIf(String::isNotBlank) ?: "Updated"

    /** The merchant's own order reference, falling back to ShipBob's order id. */
    val orderReference: String
        get() = referenceId?.takeIf(String::isNotBlank) ?: orderId?.toString() ?: ""

    /** The delivery date as `YYYY-MM-DD`. Only `Delivered` shipments carry one. */
    val deliveredOn: String?
        get() = deliveryDate?.take(10)?.takeIf { it.length == 10 }
}

/** One reason ShipBob attached to a status, e.g. `Invalid Address`. */
@Serializable
data class StatusDetail(val name: String? = null, val description: String? = null)

@Serializable
data class Tracking(val carrier: String? = null, val trackingNumber: String? = null)

@Serializable
data class Product(
    val name: String? = null,
    val sku: String? = null,
    val referenceId: String? = null,
    val inventoryItems: List<InventoryItem> = emptyList(),
)

@Serializable
data class InventoryItem(val quantity: Long? = null)

// --- the client ---------------------------------------------------------------

/** The slice of ShipBob the cron flow depends on. */
interface Orders {
    /**
     * One page of orders created since [startDate], oldest first. Only an exhausted query
     * answers with an empty page; a failure throws.
     */
    fun newOrdersPage(startDate: LocalDateTime, page: Int): List<JsonElement>

    /** One page of orders updated since [startDate], newest update first. */
    fun updatedOrdersPage(startDate: LocalDateTime, page: Int): List<JsonElement>
}

/**
 * The real ShipBob. Auth is a single bearer token (`PAN_SEC_SHIPBOB_ACCESS_TOKEN`);
 * the base URL is resolved from the token's own issuer claim.
 */
class ShipBob(pandium: Pandium) : Orders {
    private val api =
        pandium.requireSecret("shipbob_access_token").let { token ->
            val baseUrl = resolveBaseUrl(token)
            logger.info { "ShipBob API base URL: $baseUrl" }
            ApiClient(baseUrl, "Bearer $token", backoff = 3.seconds)
        }

    override fun newOrdersPage(startDate: LocalDateTime, page: Int): List<JsonElement> =
        orders(
            "StartDate" to isoTimestamp(startDate),
            "Page" to page.toString(),
            "SortOrder" to "Oldest",
        )

    override fun updatedOrdersPage(startDate: LocalDateTime, page: Int): List<JsonElement> {
        val now = LocalDateTime.now(ZoneOffset.UTC)
        // ShipBob has no sort option for last-update, so order the page here. Newest-first
        // plus a cursor that only moves to the oldest update seen means a run cut short
        // never skips an update, at the cost of re-processing a few.
        return orders("LastUpdateStartDate" to isoTimestamp(startDate), "Page" to page.toString())
            .sortedByDescending { updateDate(it, startDate, now) }
    }

    /**
     * GET one page of `/order`.
     *
     * The caller stops paging on an empty page and commits its cursor there, so only an
     * exhausted query may answer with one — anything else throws, carrying the query that
     * produced it.
     */
    private fun orders(vararg query: Pair<String, String>): List<JsonElement> {
        val page =
            try {
                api.get("/order", *query)
            } catch (e: Exception) {
                throw IllegalStateException("fetching ShipBob orders (${query.toMap()})", e)
            }
        return when (page) {
            is JsonArray -> page
            // A page past the end can arrive with no body, which reads as null.
            JsonNull -> emptyList()
            else -> error("ShipBob answered /order (${query.toMap()}) with $page")
        }
    }
}

/**
 * The order's effective update time: the oldest shipment `last_update_at` that still falls
 * after [startDate], or [now] when none qualify. ShipBob timestamps updates on shipments
 * rather than on the order.
 */
fun updateDate(order: JsonElement?, startDate: LocalDateTime, now: LocalDateTime): LocalDateTime =
    order["shipments"]
        .list
        .mapNotNull { parseTimestamp(it["last_update_at"].string) }
        .filter { it > startDate && it < now }
        .minOrNull() ?: now
