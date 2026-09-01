package sb2gorgias

import java.time.LocalDateTime
import java.util.concurrent.atomic.AtomicReference
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlinx.serialization.json.JsonPrimitive

/** Flow A: the resumable order sync. */
class CronTest {
    private fun at(value: String): LocalDateTime = requireNotNull(parseTimestamp(value)) { "a test timestamp" }

    private fun cursorsFrom(start: String) = AtomicReference(Cursors(at(start), at(start)))

    /**
     * Run the sync the way a tenant with the default settings would: oldest first, and a
     * `now` comfortably later than every timestamp in the fixtures.
     */
    private fun runSync(shipbob: Orders, gorgias: Helpdesk, cursors: AtomicReference<Cursors>) =
        sync(shipbob, gorgias, cursors, newestFirst = false, now = at("2026-07-20T00:00:00"))

    private fun updatedOn(id: Long, day: Int) =
        orderUpdatedOn(id, "2026-07-%02dT00:00:00Z".format(day), "j@x.com")

    @Test
    fun `the sync pages until empty and keeps the cursor current as it goes`() {
        // Advancing the cursor per order rather than once at the end is what makes the
        // flow resumable.
        val shipbob =
            FakeShipBob(
                newPages =
                    listOf(
                        listOf(order(1, "2026-07-05T10:00:00Z", "j@x.com")),
                        listOf(order(2, "2026-07-06T10:00:00Z", "j@x.com")),
                    ),
            )
        val gorgias = RecordingGorgias()
        val cursors = cursorsFrom("2026-07-01")
        shipbob.watched = cursors

        runSync(shipbob, gorgias, cursors)

        assertEquals(listOf(1, 2, 3), shipbob.newPagesRequested) // until empty

        // What a flush would have written when page 2 was fetched: order 1 done.
        assertEquals("2026-07-05T10:00:00", shipbob.newCursorWhenFetched[2]?.let(::isoTimestamp))
        assertEquals(
            JsonPrimitive("2026-07-06T10:00:00"),
            cursors.get().asMetadata()["new_order_start_date"],
        )

        // Both orders batch onto one customer: created once, then updated.
        assertEquals(1, gorgias.created.size)
        val (_, customer) = gorgias.updated.last()
        assertEquals(2, customer["data"]["pandium"]["shipbob_orders"].list.size)
    }

    @Test
    fun `the updated cursor lands on the oldest update across every page`() {
        // Pages are each sorted newest-first, but not relative to each other, so the
        // cursor has to be the oldest update seen anywhere.
        val shipbob =
            FakeShipBob(
                updatedPages =
                    listOf(
                        listOf(updatedOn(1, 18), updatedOn(2, 17)),
                        listOf(updatedOn(3, 11), updatedOn(4, 12)), // the oldest update overall
                        listOf(updatedOn(5, 16)), // newer again, after the oldest page
                    ),
            )
        val cursors = cursorsFrom("2026-07-01")
        shipbob.watched = cursors

        runSync(shipbob, RecordingGorgias(), cursors)

        assertEquals(
            JsonPrimitive("2026-07-11T00:00:00"), // not order 5, the last one processed
            cursors.get().asMetadata()["updated_order_start_date"],
        )

        // Until the last page is in the minimum is provisional, so a flush partway
        // through writes the value the run started with.
        for (page in 1..3) {
            assertEquals(
                "2026-07-01T00:00:00",
                shipbob.updatedCursorWhenFetched[page]?.let(::isoTimestamp),
                "the cursor moved while page $page was still outstanding",
            )
        }
    }

    @Test
    fun `a page that fails to fetch ends the run rather than committing a cursor`() {
        // A page that errors has to stay distinguishable from the empty page that ends
        // the loop, or the run would stop early and commit a cursor for pages it never
        // read.
        val shipbob =
            FakeShipBob(
                updatedPages =
                    listOf(
                        listOf(updatedOn(1, 18)),
                        listOf(updatedOn(2, 11)), // never read: the fetch fails first
                    ),
                failingPage = 2,
            )
        val cursors = cursorsFrom("2026-07-01")

        assertFailsWith<IllegalStateException>("a failed fetch is not an exhausted query") {
            runSync(shipbob, RecordingGorgias(), cursors)
        }

        // Stopped at the failure rather than paging on.
        assertEquals(listOf(1, 2), shipbob.updatedPagesRequested)
    }
}
