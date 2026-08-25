package sb2gorgias

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlin.time.Duration.Companion.seconds
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray
import kotlinx.serialization.json.putJsonObject

private val logger = KotlinLogging.logger {}

/**
 * Gorgias validates the shape of an email before it will store it; mirror that check so
 * the two systems agree on which recipients get an email-keyed customer and which fall
 * back to a synthetic key. [Regex.matches] anchors on its own, so the pattern carries no
 * `^` or `$`.
 */
private val EMAIL =
    Regex(
        """([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([\]!#-\[^-~ \t]|(\\[\t -~]))+")""" +
            """@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])""",
    )

/** Whether Gorgias would accept [email] as an email address. */
fun isValidEmail(email: String): Boolean = !email.contains(".@") && EMAIL.matches(email)

/**
 * How a Gorgias customer is identified.
 *
 * A ShipBob recipient often has no usable email, so both flows fall back to a synthetic
 * key built from the recipient's name and address. Making that a sealed type rather than
 * a pair of optional arguments means there is always exactly one key, the `when` over it
 * is exhaustive without an else branch, and the lookup and the created record cannot
 * disagree about it.
 */
sealed interface CustomerKey {
    /** The key as Gorgias stores it on the customer's `external_id`. */
    val value: String

    data class Email(override val value: String) : CustomerKey

    data class ExternalId(override val value: String) : CustomerKey

    /** The query parameter `GET /customers` looks the customer up by. */
    val query: Pair<String, String>
        get() =
            when (this) {
                is Email -> "email" to value.lowercase()
                is ExternalId -> "external_id" to value
            }

    companion object {
        /**
         * A valid recipient email when there is one, otherwise a synthetic
         * `name address1 city country`. Both flows key on this, so a webhook ticket
         * lands on the same record that carries the customer's order history.
         */
        fun forRecipient(recipient: Recipient): CustomerKey {
            recipient.email?.takeIf(::isValidEmail)?.let { return Email(it) }
            val (address1, city, country) = recipient.address
            return ExternalId(listOf(recipient.name, address1, city, country).joinToString(" ") { it.orEmpty() })
        }
    }
}

/** Body for `POST /customers` when the customer does not yet exist. */
fun newCustomerPayload(recipient: Recipient, key: CustomerKey): JsonObject = buildJsonObject {
    put("name", recipient.name.orEmpty())
    put("external_id", key.value)
    if (key is CustomerKey.Email) put("email", key.value)
    putJsonObject("data") { putJsonObject("pandium") { putJsonArray("shipbob_orders") {} } }
}

/** ShipBob timestamps the sidebar shows as dates rather than as machine-readable text. */
private val DISPLAY_DATE_FIELDS = setOf("estimated_fulfillment_date", "actual_fulfillment_date")

/** The fields of a ShipBob order that reach the sidebar exactly as ShipBob sent them. */
private val PASSTHROUGH_FIELDS =
    listOf(
        "reference_id",
        "order_number",
        "status",
        "type",
        "channel",
        "shipping_method",
        "recipient",
        "products",
        "tags",
    )

/**
 * One shipment as the sidebar shows it: ShipBob's own fields, with the dates made
 * readable and a deep link back into ShipBob added.
 */
private fun sidebarShipment(shipment: JsonElement): JsonElement {
    val fields = shipment.obj ?: return shipment
    return buildJsonObject {
        fields.forEach { (key, value) ->
            if (key in DISPLAY_DATE_FIELDS && value.string != null) {
                put(key, displayTimestamp(value.string))
            } else {
                put(key, value)
            }
        }
        put("url", "https://web.shipbob.com/App/Merchant/#/Orders/${fields["id"].long ?: ""}/")
    }
}

/** The single order entry stored in `data.pandium.shipbob_orders`. */
fun orderEntry(order: JsonElement): JsonObject = buildJsonObject {
    put("id", order["id"] ?: JsonNull)
    put("created_date", displayTimestamp(order["created_date"].string))
    put("purchase_date", displayTimestamp(order["purchase_date"].string))
    PASSTHROUGH_FIELDS.forEach { field -> put(field, order[field] ?: JsonNull) }
    putJsonArray("shipments") { order["shipments"].list.forEach { add(sidebarShipment(it)) } }
}

/**
 * The slice of Gorgias the two flows depend on: find-or-create a customer, write order
 * history onto them, open a ticket.
 */
interface Helpdesk {
    /**
     * The customer's detail record or `null` if there is no such customer.
     * The list endpoint omits `data`, which is where the order history lives.
     */
    fun findCustomer(key: CustomerKey): JsonObject?

    /** Create the customer and return their new id. */
    fun createCustomer(payload: JsonObject): Long

    fun updateCustomer(id: Long, payload: JsonObject)

    fun createTicket(payload: JsonObject): JsonElement
}

/**
 * The real Gorgias.
 *
 * Auth is OAuth2 via Pandium's `gorgias-oauth` connector. Pandium runs the authorization
 * flow when the tenant connects and handles refreshes, so this client never sees a client
 * secret, never posts to a token endpoint, and holds no refresh logic.
 */
class Gorgias(pandium: Pandium) : Helpdesk {
    private val api =
        run {
            val token = pandium.requireSecret("gorgias_oauth_access_token")
            val account = pandium.requireSecret("gorgias_oauth_account")
            // The connector reports its own scheme; every current Gorgias token is a
            // bearer, but read it rather than assume it.
            val tokenType = pandium.secrets["gorgias_oauth_token_type"]?.takeIf(String::isNotBlank) ?: "Bearer"
            val baseUrl = "https://${account.lowercase()}.gorgias.com/api"
            logger.info { "Gorgias API base URL: $baseUrl" }
            ApiClient(baseUrl, "$tokenType $token", backoff = 2.seconds)
        }

    override fun findCustomer(key: CustomerKey): JsonObject? {
        val (parameter, value) = key.query
        logger.info { "looking for gorgias customer by $parameter $value" }

        // An email or external_id maps to at most one customer, so there is nothing to
        // paginate through.
        val row = api.get("/customers", parameter to value)["data"].list.firstOrNull()
        if (row == null) {
            logger.info { "customer not found" }
            return null
        }

        val id = checkNotNull(row["id"].long) { "Gorgias customer has no id" }
        logger.info { "customer found: $id" }
        return checkNotNull(api.get("/customers/$id").obj) { "Gorgias customer $id has no detail record" }
    }

    override fun createCustomer(payload: JsonObject): Long {
        logger.info { "creating new gorgias customer" }
        val created = api.post("/customers", payload)
        return checkNotNull(created["id"].long) { "Gorgias created a customer without an id" }
    }

    override fun updateCustomer(id: Long, payload: JsonObject) {
        logger.info { "updating gorgias customer $id" }
        api.put("/customers/$id", payload)
    }

    override fun createTicket(payload: JsonObject): JsonElement {
        logger.info { "creating gorgias ticket" }
        return api.post("/tickets", payload)
    }
}
