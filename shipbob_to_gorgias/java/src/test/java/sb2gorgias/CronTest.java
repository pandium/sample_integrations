package sb2gorgias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;

class CronTest {

    /** A ShipBob-shaped timestamp days back - seven fractional digits, as the real API
     * sends - inside clamp's 30-day window. */
    private static String ago(int days) {
        OffsetDateTime dt = OffsetDateTime.now(ZoneOffset.UTC).minusDays(days);
        return dt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")) + ".1234567+00:00";
    }

    @Test
    void clampBoundsCursorBetweenOneMonthAgoAndNow() {
        OffsetDateTime now = OffsetDateTime.of(2026, 7, 16, 12, 0, 0, 0, ZoneOffset.UTC);
        assertEquals(OffsetDateTime.of(2026, 7, 10, 0, 0, 0, 0, ZoneOffset.UTC),
                Cron.clamp("2026-07-10T00:00:00", now)); // in range
        assertEquals(now, Cron.clamp("2099-01-01T00:00:00", now)); // future -> now
        assertEquals(now.minus(Cron.ONE_MONTH), Cron.clamp(null, now)); // missing -> floor
    }

    @Test
    void runPagesUntilEmptyUpsertsCustomerAndAdvancesCursor() {
        FakeShipBobClient shipbob = new FakeShipBobClient(
                List.of(List.of(
                        Helpers.makeOrder(1, ago(6), "jane@example.com"),
                        Helpers.makeOrder(2, ago(5), "jane@example.com")
                )),
                List.of(),
                null
        );
        FakeGorgiasClient gorgias = new FakeGorgiasClient();
        Pandium pandium = Helpers.pandium().secrets(Helpers.GORGIAS_SECRETS)
                .config(Map.of("order_start_date", ago(20))).build();

        JSONObject record = Cron.runCron(pandium, new Cron.Deps(shipbob, gorgias, new FakeWatchdogArmer(),
                code -> { throw new SimulatedExit(code); }, OffsetDateTime.now(ZoneOffset.UTC)));

        assertEquals(List.of(1, 2), shipbob.pages.get("new")); // paged until the empty page
        assertEquals(1, gorgias.createLog.size()); // both orders batch onto one customer
        assertEquals(Util.trimTo(ago(5), 26), record.getString("new_order_start_date")); // advanced to the last order

        JSONObject finalCustomer = gorgias.updateLog.get(gorgias.updateLog.size() - 1).getValue();
        var finalOrders = finalCustomer.getJSONObject("data").getJSONObject("pandium").getJSONArray("shipbob_orders");
        List<Long> ids = new java.util.ArrayList<>();
        for (int i = 0; i < finalOrders.length(); i++) {
            ids.add(finalOrders.getJSONObject(i).getLong("id"));
        }
        ids.sort(null);
        assertEquals(List.of(1L, 2L), ids);
    }

    /** Pages are each sorted newest-first, but not relative to each other, so the cursor has
     * to be the oldest update seen anywhere - not the last one processed. */
    @Test
    void runAdvancesUpdatedCursorToOldestUpdateAcrossPages() {
        FakeShipBobClient shipbob = new FakeShipBobClient(
                List.of(),
                List.of(
                        List.of(Helpers.makeOrder(1, ago(2), "j@x.com"), Helpers.makeOrder(2, ago(3), "j@x.com")),
                        List.of(Helpers.makeOrder(3, ago(9), "j@x.com"), Helpers.makeOrder(4, ago(8), "j@x.com")),
                        List.of(Helpers.makeOrder(5, ago(4), "j@x.com"))
                ),
                null
        );
        Pandium pandium = Helpers.pandium().secrets(Helpers.GORGIAS_SECRETS)
                .config(Map.of("order_start_date", ago(20))).build();

        JSONObject record = Cron.runCron(pandium, new Cron.Deps(shipbob, new FakeGorgiasClient(), new FakeWatchdogArmer(),
                code -> { throw new SimulatedExit(code); }, OffsetDateTime.now(ZoneOffset.UTC)));

        String expected = Cron.formatCursor(Util.parseTimestamp(ago(9)).orElseThrow());
        assertEquals(expected, record.getString("updated_order_start_date")); // not order 5, the last processed
    }

    /** The two cursors resume differently. new_order_start_date climbs per order over an
     * oldest-first query, so it is sound wherever the run stops. updated_order_start_date is
     * the minimum across every page, so it only holds once the query is exhausted - an unread
     * page can carry an older update - and a run cut short flushes the value it started
     * with. */
    @Test
    void timeoutFlushesTheFinishedHalfAndLeavesTheInterruptedOne() {
        String start = ago(20);
        FakeWatchdogArmer armer = new FakeWatchdogArmer();
        FakeShipBobClient shipbob = new FakeShipBobClient(
                List.of(List.of(Helpers.makeOrder(1, ago(6), "j@x.com"))),
                List.of(
                        List.of(Helpers.makeOrder(2, ago(2), "j@x.com")),
                        List.of(Helpers.makeOrder(3, ago(9), "j@x.com")) // never read
                ),
                (half, page) -> {
                    if ("updated".equals(half) && page == 2) {
                        armer.fire();
                    }
                }
        );
        Pandium pandium = Helpers.pandium().secrets(Helpers.GORGIAS_SECRETS)
                .config(Map.of("order_start_date", start)).build();

        ByteArrayOutputStream capturedOut = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(capturedOut, true, StandardCharsets.UTF_8));
        SimulatedExit thrown = null;
        try {
            Cron.runCron(pandium, new Cron.Deps(shipbob, new FakeGorgiasClient(), armer,
                    code -> { throw new SimulatedExit(code); }, OffsetDateTime.now(ZoneOffset.UTC)));
        } catch (SimulatedExit e) {
            thrown = e;
        } finally {
            System.setOut(originalOut);
        }

        assertNotNull(thrown); // a timed-out run still succeeds, so progress merges
        assertEquals(0, thrown.code);
        String[] lines = capturedOut.toString(StandardCharsets.UTF_8).strip().split("\n");
        JSONObject flushed = new JSONObject(lines[lines.length - 1]);
        assertEquals(Util.trimTo(ago(6), 26), flushed.getString("new_order_start_date")); // that half finished
        assertEquals(Util.trimTo(start, 26), flushed.getString("updated_order_start_date")); // this one did not
    }
}
