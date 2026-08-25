package sb2gorgias

import io.github.oshai.kotlinlogging.KotlinLogging
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.concurrent.atomic.AtomicReference
import kotlin.concurrent.thread
import kotlin.system.exitProcess
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonObject

private val logger = KotlinLogging.logger {}

/**
 * The cron flow: ShipBob orders → the Gorgias customer sidebar.
 *
 * Keeps each Gorgias customer's `data.pandium.shipbob_orders` in sync with that
 * customer's recent ShipBob orders. Runs on a schedule and resumes where the last run
 * left off, using a cursor stored in tenant metadata.
 *
 * Pandium bounds a run at roughly ten minutes, so a tenant with a large backlog will not
 * finish in one pass. To stay resumable, the sync keeps a single [Cursors] value current
 * as each order is processed, and a watchdog thread flushes it if the run gets close to
 * the limit.
 */

/**
 * Nine minutes: a self-imposed deadline a minute inside Pandium's limit, which leaves
 * room to write the cursor before the platform stops the run.
 */
val DEADLINE = 9.minutes

/** How far back the very first sync may reach, and the floor every later cursor is held to. */
private const val MAX_LOOKBACK_DAYS = 30L

/** How many of a customer's most recent orders the sidebar keeps. */
private const val MAX_ORDERS_TO_SYNC = 10

/**
 * The point each of the two order queries resumes from.
 *
 * The two halves are written at different times, because their queries order results
 * differently:
 *
 * * [newOrders] is fetched oldest-first, so `created_date` climbs as the sync goes. It
 *   advances per order and is sound to flush at any moment.
 * * [updatedOrders] is the *minimum* update across the whole result set, which is not
 *   known until the last page is read. It is written once the loop ends, so a run cut
 *   short leaves it where the run found it.
 *
 * Either way it tracks orders *attempted*, not orders Gorgias accepted: `processOrder`
 * logs a write failure and moves on, so one unreachable customer costs that customer's
 * order rather than the rest of the backlog.
 *
 * The two cursors are held as one immutable pair in an [AtomicReference].
 */
data class Cursors(val newOrders: LocalDateTime, val updatedOrders: LocalDateTime) {
    /**
     * The cursor as Pandium stores it. Only these two keys are written, so the shallow
     * merge leaves the webhook flow's `processed_events` untouched.
     */
    fun asMetadata(): JsonObject = buildJsonObject {
        put("new_order_start_date", isoTimestamp(newOrders))
        put("updated_order_start_date", isoTimestamp(updatedOrders))
    }
}

/**
 * Hold a cursor inside `[now - 30 days, now]`. A missing or unparseable value — a first
 * run, mostly — starts at the floor, the oldest window ever fetched.
 */
fun clamp(value: String?, now: LocalDateTime): LocalDateTime {
    val floor = now.minusDays(MAX_LOOKBACK_DAYS)
    return parseTimestamp(value)?.coerceIn(floor, now) ?: floor
}

fun runCronFlow(pandium: Pandium): JsonObject {
    val now = LocalDateTime.now(ZoneOffset.UTC)
    val metadata = pandium.metadata
    // The end user supplies the start date from the connection settings form until the
    // first run has written a cursor of its own.
    val configured = pandium.config["order_start_date"]?.takeIf(String::isNotBlank)
    fun cursorFor(key: String) = clamp(metadata[key].string?.takeIf(String::isNotBlank) ?: configured, now)

    val cursors =
        AtomicReference(
            Cursors(
                newOrders = cursorFor("new_order_start_date"),
                updatedOrders = cursorFor("updated_order_start_date"),
            ),
        )
    flushAtDeadline(cursors, DEADLINE)

    sync(
        shipbob = ShipBob(pandium),
        gorgias = Gorgias(pandium),
        cursors = cursors,
        newestFirst = pandium.flag("newest_order_first"),
        now = now,
    )

    // Reached the end in time. The watchdog is a daemon thread, so it does not hold the
    // JVM open.
    return cursors.get().asMetadata()
}

/**
 * Flush the cursor and end the run successfully if the sync is still going when
 * [deadline] passes.
 *
 * The sync loop and the watchdog share one [AtomicReference], so the watchdog always
 * writes whatever the loop had reached.
 */
private fun flushAtDeadline(cursors: AtomicReference<Cursors>, deadline: Duration) {
    thread(isDaemon = true, name = "deadline-flush") {
        Thread.sleep(deadline.inWholeMilliseconds)
        logger.warn { "approaching the run-time limit — flushing the cursor for the next run" }
        // The same writer the normal path uses, so there is exactly one route to stdout,
        // and exit 0 so Pandium counts the run as a success and merges the partial cursor.
        updateMetadata(cursors.get().asMetadata())
        exitProcess(0)
    }
}

/**
 * Run both halves of the sync, advancing [cursors] as each order is processed.
 *
 * A failed ShipBob fetch throws, ending the run without writing metadata, so the next run
 * resumes from the last cursor a completed run stored. Re-syncing what it covers again is
 * harmless: the customer write is an idempotent PUT.
 *
 * Split out from [runCronFlow] so it can be driven by test doubles: everything it touches
 * arrives through the two interfaces.
 */
fun sync(
    shipbob: Orders,
    gorgias: Helpdesk,
    cursors: AtomicReference<Cursors>,
    newestFirst: Boolean,
    now: LocalDateTime,
) {
    // Orders for each customer batch onto a single record.
    val customers = mutableMapOf<String, CustomerRecord>()

    // New orders come back oldest-first, so created_date advances monotonically and the
    // last order processed is the right place to resume from.
    val newStart = cursors.get().newOrders
    logger.info { "syncing new ShipBob orders since ${isoTimestamp(newStart)}" }
    for (order in ordersUntilExhausted { page -> shipbob.newOrdersPage(newStart, page) }) {
        logger.info { "processing new order with id ${order["id"]}" }
        processOrder(order, gorgias, customers, newestFirst)
        parseTimestamp(order["created_date"].string)?.let { created ->
            cursors.updateAndGet { it.copy(newOrders = created) }
        }
    }

    // Updated orders are sorted newest-first within a page but not across pages, so the
    // cursor is the *minimum* over every order processed — not whatever the last one
    // happened to carry. It is kept out of `cursors` until the loop ends: every update is
    // by construction later than the starting point, so folding that in would pin the
    // cursor there forever, and a partial minimum would sit newer than the pages still
    // unread.
    val updatedStart = cursors.get().updatedOrders
    logger.info { "syncing updated ShipBob orders since ${isoTimestamp(updatedStart)}" }
    var oldestUpdate: LocalDateTime? = null
    for (order in ordersUntilExhausted { page -> shipbob.updatedOrdersPage(updatedStart, page) }) {
        logger.info { "processing updated order with id ${order["id"]}" }
        processOrder(order, gorgias, customers, newestFirst)

        val updated = updateDate(order, updatedStart, now)
        oldestUpdate = minOf(updated, oldestUpdate ?: updated)
    }

    // Every page is in, so the minimum is final and safe to resume from.
    oldestUpdate?.let { oldest -> cursors.updateAndGet { it.copy(updatedOrders = oldest) } }
}

/**
 * The orders of a paginated ShipBob query, page by page, until it answers with an empty
 * page.
 *
 * The sequence is lazy, so a page is fetched only once the previous one has been
 * processed and the cursor has moved with it — which is what keeps a flush mid-run
 * honest about how far the sync actually got.
 *
 * An empty page is the commit signal, so a failed fetch must not look like one: [fetch]
 * throws instead, and the exception travels straight out of the loop consuming this.
 */
private fun ordersUntilExhausted(fetch: (Int) -> List<JsonElement>): Sequence<JsonElement> =
    generateSequence(1) { it + 1 }
        .map(fetch)
        .takeWhile { page -> page.isNotEmpty() }
        .flatten()

/**
 * Find-or-create the order's Gorgias customer, then write their updated
 * `data.pandium.shipbob_orders` back.
 *
 * Every Gorgias failure here is logged and swallowed so that the sync keeps going. The
 * order is not picked up again on the next run: see [Cursors] for what that means for the
 * cursor.
 */
private fun processOrder(
    order: JsonElement,
    gorgias: Helpdesk,
    customers: MutableMap<String, CustomerRecord>,
    newestFirst: Boolean,
) {
    val recipient = Recipient.of(order)
    val key = CustomerKey.forRecipient(recipient)

    val customer =
        customers[key.value]
            ?: try {
                lookUp(gorgias, recipient, key).also { customers[key.value] = it }
            } catch (e: Exception) {
                logger.error(e) { "skipping order ${order["id"]} — cannot fetch customer ${key.value}" }
                return
            }

    customer.addOrder(orderEntry(order), newestFirst)

    try {
        val id = customer.id
        if (id == null) {
            // Remember the new id so the next order for this customer updates the record
            // instead of creating a second one.
            customer.id = gorgias.createCustomer(customer.payload())
        } else {
            gorgias.updateCustomer(id, customer.payload())
        }
    } catch (e: Exception) {
        logger.error(e) { "failed to upsert Gorgias customer ${key.value}" }
    }
}

/** The customer Gorgias already holds under [key], or the payload to create them with. */
private fun lookUp(gorgias: Helpdesk, recipient: Recipient, key: CustomerKey): CustomerRecord =
    when (val found = gorgias.findCustomer(key)) {
        null -> CustomerRecord(newCustomerPayload(recipient, key), id = null)
        else -> CustomerRecord(buildJsonObject { put("data", found["data"] ?: JsonNull) }, found["id"].long)
    }

/**
 * The Gorgias customer this run is building up for one customer key: what Gorgias already
 * held, plus the orders this run has added.
 */
private class CustomerRecord(
    /**
     * What Gorgias already has — `{"data": ...}` for a customer this run found, or the
     * whole create payload for one it has not created yet.
     */
    private val stored: JsonObject,
    /** `null` until the customer exists in Gorgias; the create call fills it in. */
    var id: Long?,
) {
    private val orders: MutableList<JsonElement> =
        stored["data"]["pandium"]["shipbob_orders"].list.toMutableList()

    /**
     * Merge [entry] into the order list — replacing the order with the same id, or adding
     * it and trimming the list back to the most recent [MAX_ORDERS_TO_SYNC].
     */
    fun addOrder(entry: JsonObject, newestFirst: Boolean) {
        val existing = orders.indexOfFirst { it["id"] == entry["id"] }
        if (existing >= 0) {
            orders[existing] = entry // replaced in place: order and length are unchanged
            return
        }

        orders += entry
        orders.sortBy { it["id"].long ?: 0L }
        if (newestFirst) orders.reverse()
        if (orders.size > MAX_ORDERS_TO_SYNC) {
            // The list is sorted, so the orders to drop are always at the far end.
            val keep = if (newestFirst) orders.take(MAX_ORDERS_TO_SYNC) else orders.takeLast(MAX_ORDERS_TO_SYNC)
            orders.clear()
            orders += keep
        }
    }

    /**
     * The record as Gorgias receives it.
     *
     * We rebuild the record to keep `data` keys this integration does not own
     * exactly where they were. This also defends against a hand-edited `{"pandium": null}`.
     */
    fun payload(): JsonObject = buildJsonObject {
        stored.forEach { (key, value) -> if (key != "data") put(key, value) }
        id?.let { put("id", it) }
        putJsonObject("data") {
            stored["data"].obj?.forEach { (key, value) -> if (key != "pandium") put(key, value) }
            putJsonObject("pandium") {
                stored["data"]["pandium"].obj?.forEach { (key, value) ->
                    if (key != "shipbob_orders") put(key, value)
                }
                put("shipbob_orders", JsonArray(orders))
            }
        }
    }
}
