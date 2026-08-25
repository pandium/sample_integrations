package sb2gorgias

import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

/** Flow B: a ticket per shipment status, deduped. */
class WebhookTest {
    private val now: OffsetDateTime = OffsetDateTime.now(ZoneOffset.UTC)

    private fun ago(minutes: Long) = now.minusMinutes(minutes).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)

    /**
     * Run the flow over [deliveries], starting from the `processed_events` a previous run
     * left in tenant metadata.
     */
    private fun runProcess(
        deliveries: List<WebhookDelivery>,
        alreadyProcessed: JsonElement? = null,
        knownCustomers: List<String> = emptyList(),
    ): Pair<Map<String, JsonElement>, RecordingGorgias> {
        val gorgias = RecordingGorgias(knownCustomers)
        val processed = prune(alreadyProcessed, now.toLocalDateTime())
        process(deliveries, gorgias, processed, now)
        return processed to gorgias
    }

    @Test
    fun `a delivery opens a ticket and writes only processed events`() {
        val (processed, gorgias) =
            runProcess(
                listOf(delivery("t1", shipmentEvent(456789, "Delivered"))),
                knownCustomers = listOf("jane@example.com"),
            )

        val ticket = gorgias.tickets.single()
        // Linked to the customer the fake already knew about.
        assertEquals(buildJsonObject { put("id", 40) }, ticket["customer"])
        assertEquals(
            listOf("shipbob-shipment", "shipbob-delivered"),
            ticket["tags"].list.map { it["name"].string },
        )

        val body = ticket["messages"].list.single()["body_text"].string.orEmpty()
        assertContains(body, "is now Delivered")
        assertContains(body, "Tracking: USPS 9400100000000000000000")
        assertContains(processed.keys, "456789:Delivered")
    }

    @Test
    fun `a repeated status is dropped but the next status still tickets`() {
        // Dedupe is per shipment *and* status, and entries age out of the map after the
        // prune window.
        val (processed, gorgias) =
            runProcess(
                listOf(
                    delivery("t1", shipmentEvent(1, "OnHold")),
                    delivery("t2", shipmentEvent(1, "OnHold")), // a redelivery
                    delivery("t3", shipmentEvent(1, "Delivered")), // genuinely next
                ),
                alreadyProcessed =
                    buildJsonObject {
                        put("2:Delivered", ago(0)) // recent -> kept
                        put("3:Delivered", ago(45)) // stale -> pruned
                    },
                knownCustomers = listOf("jane@example.com"),
            )

        assertEquals(2, gorgias.tickets.size) // not three
        assertEquals(listOf("1:Delivered", "1:OnHold", "2:Delivered"), processed.keys.sorted())
    }

    @Test
    fun `a recipient with no email gets a customer keyed on their address`() {
        val (processed, gorgias) = runProcess(listOf(delivery("t1", onholdEvent())))

        val created = gorgias.created.single()
        assertNull(created["email"])
        // The synthetic key the cron flow uses too: name address1 city country.
        assertEquals("Jane Buyer 100 Nowhere Blvd Gotham City US", created["external_id"].string)

        // Hung off the customer this run just created.
        val ticket = gorgias.tickets.single()
        assertEquals(buildJsonObject { put("id", 1000) }, ticket["customer"])

        // The body carries only what ShipBob sent for this status.
        val body = ticket["messages"].list.single()["body_text"].string.orEmpty()
        assertContains(body, "is now OnHold")
        assertContains(body, "Reason: Invalid Address; Payment Failure")
        assertFalse(body.contains("Tracking:"), "an OnHold shipment carries none")
        assertContains(body, "4 x Pinnacle Shampoo (PIN-100)")
        assertTrue("107414278:OnHold" in processed)
    }
}
