package sb2gorgias;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;

import org.json.JSONObject;

/** Serves canned pages for either half and records the pages asked for.
 *
 * onPage runs before a page is served, which is where a test stands in for the watchdog
 * firing or the API going away mid-query. */
final class FakeShipBobClient implements ShipBobClient {
    private final List<List<JSONObject>> newPages;
    private final List<List<JSONObject>> updatedPages;
    private final BiConsumer<String, Integer> onPage;
    final Map<String, List<Integer>> pages = new HashMap<>(Map.of("new", new ArrayList<>(), "updated", new ArrayList<>()));

    FakeShipBobClient(List<List<JSONObject>> newPages, List<List<JSONObject>> updatedPages,
            BiConsumer<String, Integer> onPage) {
        this.newPages = newPages;
        this.updatedPages = updatedPages;
        this.onPage = onPage != null ? onPage : (half, page) -> {
        };
    }

    private List<JSONObject> servePage(String half, List<List<JSONObject>> allPages, int page) {
        pages.get(half).add(page);
        onPage.accept(half, page);
        return page <= allPages.size() ? allPages.get(page - 1) : List.of();
    }

    @Override
    public List<JSONObject> newOrdersPage(OffsetDateTime cursor, int page) {
        return servePage("new", newPages, page);
    }

    @Override
    public List<JSONObject> updatedOrdersPage(OffsetDateTime cursor, int page) {
        return servePage("updated", updatedPages, page);
    }

    @Override
    public OffsetDateTime updateDate(JSONObject order, OffsetDateTime cursor) {
        String lastUpdateAt = order.getJSONArray("shipments").getJSONObject(0).getString("last_update_at");
        return Util.parseTimestamp(lastUpdateAt).orElseThrow();
    }
}

/** Thrown by a test's fake Cron.Deps.exit consumer in place of System.exit, so a simulated
 * watchdog timeout can be asserted on instead of killing the test JVM. Extends Error, not
 * RuntimeException, so it is never accidentally swallowed by Cron's own
 * catch (RuntimeException) blocks around the ShipBob calls - it must unwind past them
 * untouched, the same way a real process exit would never return control to that code either. */
final class SimulatedExit extends Error {
    final int code;

    SimulatedExit(int code) {
        super("simulated exit " + code);
        this.code = code;
    }
}

/** Captures the callback a real watchdog would eventually run, so a test can invoke it
 * deterministically instead of waiting real minutes. */
final class FakeWatchdogArmer implements Cron.WatchdogArmer {
    Runnable capturedTimeout;
    boolean cancelled;

    @Override
    public Runnable arm(Duration deadline, Runnable onTimeout) {
        capturedTimeout = onTimeout;
        return () -> cancelled = true;
    }

    void fire() {
        if (capturedTimeout != null) {
            capturedTimeout.run();
        }
    }
}
