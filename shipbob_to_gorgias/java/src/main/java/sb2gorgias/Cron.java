package sb2gorgias;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.IntConsumer;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONObject;

/** The cron flow: ShipBob orders -> Gorgias customer sidebar.
 *
 * Keeps each Gorgias customer's data.pandium.shipbob_orders in sync with that customer's
 * recent ShipBob orders. Runs on a schedule and resumes where the last run left off, using
 * tenant metadata as the cursor.
 *
 * The run is bounded at ~10 minutes by Pandium. To stay resumable, the loop keeps cursor state
 * current as each order is processed, and a watchdog timer flushes that state before the hard
 * kill. Exiting 0 on timeout means the partial cursor is merged into metadata and the next run
 * picks up from there.
 *
 * The two cursors resume differently. new_order_start_date climbs per order over an
 * oldest-first query, so it is sound wherever the run stops. updated_order_start_date is the
 * minimum across every page, so it only holds once the query is exhausted - an unread page can
 * carry an older update - and a run cut short leaves it where it started. Re-syncing what it
 * covers again is harmless: customer writes are idempotent PUTs. */
final class Cron {
    private static final Logger LOGGER = Pandium.newLogger("cron");

    private static final Duration ALARM_DURATION = Duration.ofSeconds(540); // self-imposed 9-min alarm
    static final Duration ONE_MONTH = Duration.ofDays(30);
    private static final int MAX_ORDERS_TO_SYNC = 10; // most recent N orders kept on each customer

    private Cron() {
    }

    /** Keeps a cursor within [now - 1 month, now]. Unparseable/missing values fall back to
     * one month ago (the oldest window we ever fetch). */
    static OffsetDateTime clamp(String value, OffsetDateTime now) {
        OffsetDateTime floor = now.minus(ONE_MONTH);
        Optional<OffsetDateTime> parsed = Util.parseTimestamp(value);
        if (parsed.isEmpty()) {
            return floor;
        }
        OffsetDateTime dt = parsed.get();
        if (dt.isBefore(floor)) {
            return floor;
        }
        if (dt.isAfter(now)) {
            return now;
        }
        return dt;
    }

    private static final DateTimeFormatter CURSOR_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS");

    static String formatCursor(OffsetDateTime t) {
        return t.withOffsetSameInstant(ZoneOffset.UTC).format(CURSOR_FORMAT);
    }

    /** The timeout record: the cursor written on either outcome. Shared between the paging
     * loop and the watchdog thread, so every access - including log lines - must go through
     * the synchronized accessors below. */
    static final class CursorState {
        private String newOrderStartDate;
        private String updatedOrderStartDate;

        CursorState(String newOrderStartDate, String updatedOrderStartDate) {
            this.newOrderStartDate = newOrderStartDate;
            this.updatedOrderStartDate = updatedOrderStartDate;
        }

        synchronized void setNew(String v) {
            newOrderStartDate = v;
        }

        synchronized void setUpdated(String v) {
            updatedOrderStartDate = v;
        }

        synchronized String getNew() {
            return newOrderStartDate;
        }

        synchronized String getUpdated() {
            return updatedOrderStartDate;
        }

        synchronized JSONObject snapshot() {
            JSONObject result = new JSONObject();
            result.put("new_order_start_date", newOrderStartDate);
            result.put("updated_order_start_date", updatedOrderStartDate);
            return result;
        }
    }

    private static long orderId(JSONObject order) {
        return Util.toLong(order.opt("id"));
    }

    /** Merges orderPayload into a customer's order list (replace by id, else append), then
     * sorts and trims to the most recent maxOrdersToSync. */
    static List<JSONObject> upsertOrder(List<JSONObject> orders, JSONObject orderPayload, boolean newestFirst) {
        long newId = orderId(orderPayload);
        for (int i = 0; i < orders.size(); i++) {
            if (orderId(orders.get(i)) == newId) {
                orders.set(i, orderPayload); // in-place replace; no re-sort/trim needed
                return orders;
            }
        }

        orders.add(orderPayload);
        Comparator<JSONObject> byId = Comparator.comparingLong(Cron::orderId);
        orders.sort(newestFirst ? byId.reversed() : byId);
        if (orders.size() > MAX_ORDERS_TO_SYNC) {
            orders = newestFirst
                    ? new ArrayList<>(orders.subList(0, MAX_ORDERS_TO_SYNC))
                    : new ArrayList<>(orders.subList(orders.size() - MAX_ORDERS_TO_SYNC, orders.size()));
        }
        return orders;
    }

    /** Finds-or-creates the order's Gorgias customer, then PUT/POSTs its updated
     * data.pandium.shipbob_orders. cache accumulates customer payloads within a run so
     * multiple orders for one customer batch onto the same record. */
    static void processOrder(JSONObject order, GorgiasClient gorgias, Map<String, JSONObject> cache,
            boolean newestFirst) {
        String key = GorgiasApi.customerKey(order);
        String email = GorgiasApi.validEmail(Util.asString(Util.deepGet(order, "recipient.email", "")));

        JSONObject customer = cache.get(key);
        if (customer == null) {
            JSONObject existing;
            try {
                existing = gorgias.findCustomer(email.isEmpty() ? null : email, email.isEmpty() ? key : null);
            } catch (RuntimeException e) {
                LOGGER.log(Level.SEVERE, "cannot fetch customer; skipping order; order_id="
                        + Util.deepGet(order, "id", "") + " customer_key=" + key + " error=" + e.getMessage());
                return;
            }

            if (existing != null) {
                // Anything already under data.pandium came from outside this integration - a
                // hand-edited customer can carry {"pandium": null} - so check the type at
                // every level rather than just the leaf.
                Object dataObj = existing.opt("data");
                JSONObject data = dataObj instanceof JSONObject d ? d : new JSONObject();
                Object pandiumObj = data.opt("pandium");
                JSONObject pandium = pandiumObj instanceof JSONObject p ? p : new JSONObject();
                if (!(pandium.opt("shipbob_orders") instanceof org.json.JSONArray)) {
                    pandium.put("shipbob_orders", new org.json.JSONArray());
                }
                data.put("pandium", pandium);
                customer = new JSONObject();
                customer.put("id", existing.opt("id"));
                customer.put("data", data);
            } else {
                customer = GorgiasApi.newCustomerPayload(order, key);
            }
            cache.put(key, customer);
        }

        JSONObject data = customer.optJSONObject("data");
        JSONObject pandium = data.optJSONObject("pandium");
        org.json.JSONArray ordersAny = pandium.optJSONArray("shipbob_orders");
        List<JSONObject> orders = new ArrayList<>();
        for (int i = 0; i < ordersAny.length(); i++) {
            if (ordersAny.opt(i) instanceof JSONObject o) {
                orders.add(o);
            }
        }
        orders = upsertOrder(orders, GorgiasApi.orderDataPayload(order), newestFirst);
        pandium.put("shipbob_orders", new org.json.JSONArray(orders));

        try {
            if (customer.has("id") && !customer.isNull("id")) {
                gorgias.updateCustomer(Util.toLong(customer.opt("id")), customer);
            } else {
                customer.put("id", gorgias.createCustomer(customer));
            }
        } catch (RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Failed to upsert Gorgias customer " + key + ": " + e.getMessage());
        }
    }

    /** Schedules onTimeout to run after deadline, returning a function that cancels it.
     * Injectable so tests can trigger the timeout deterministically without waiting real
     * minutes. */
    interface WatchdogArmer {
        Runnable arm(Duration deadline, Runnable onTimeout);
    }

    private static final ScheduledExecutorService WATCHDOG_EXECUTOR = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "cron-watchdog");
        t.setDaemon(true);
        return t;
    });

    static Runnable defaultArmWatchdog(Duration deadline, Runnable onTimeout) {
        ScheduledFuture<?> future = WATCHDOG_EXECUTOR.schedule(onTimeout, deadline.toMillis(), TimeUnit.MILLISECONDS);
        return () -> future.cancel(false);
    }

    /** Everything runCron touches arrives through this - production wiring vs. test fakes. */
    static final class Deps {
        final ShipBobClient shipBob;
        final GorgiasClient gorgias;
        final WatchdogArmer armWatchdog;
        final IntConsumer exit; // defaults to System.exit; tests substitute something that doesn't kill the JVM
        final OffsetDateTime now;

        Deps(ShipBobClient shipBob, GorgiasClient gorgias, WatchdogArmer armWatchdog, IntConsumer exit,
                OffsetDateTime now) {
            this.shipBob = shipBob;
            this.gorgias = gorgias;
            this.armWatchdog = armWatchdog;
            this.exit = exit;
            this.now = now;
        }
    }

    static JSONObject cronRun(Pandium pandium) {
        ShipBobApi shipBob = new ShipBobApi(pandium);
        GorgiasApi gorgias = new GorgiasApi(pandium);
        return runCron(pandium, new Deps(shipBob, gorgias, Cron::defaultArmWatchdog, System::exit,
                OffsetDateTime.now(ZoneOffset.UTC)));
    }

    private static String firstNonEmpty(String... values) {
        for (String v : values) {
            if (v != null && !v.isEmpty()) {
                return v;
            }
        }
        return "";
    }

    /** The tested core: everything it touches arrives through deps. */
    static JSONObject runCron(Pandium pandium, Deps deps) {
        OffsetDateTime now = deps.now;
        JSONObject metadata = pandium.metadata();
        if (metadata == null) {
            metadata = new JSONObject();
        }
        String fallback = pandium.config.get("order_start_date");

        OffsetDateTime newCursor = clamp(
                firstNonEmpty(metadata.optString("new_order_start_date", ""), fallback == null ? "" : fallback), now);
        OffsetDateTime updatedCursor = clamp(
                firstNonEmpty(metadata.optString("updated_order_start_date", ""), fallback == null ? "" : fallback), now);

        CursorState state = new CursorState(formatCursor(newCursor), formatCursor(updatedCursor));

        Runnable cancel = deps.armWatchdog.arm(ALARM_DURATION, () -> {
            LOGGER.log(Level.SEVERE, "approaching the run-time limit; flushing cursor for the next run");
            // Same writer the normal path uses, so there is exactly one route to stdout.
            pandium.updateMetadata(state.snapshot());
            deps.exit.accept(0); // timed-out run still counts as successful -> partial cursor merged
        });

        Map<String, JSONObject> cache = new HashMap<>();
        boolean newestFirst = "true".equalsIgnoreCase(pandium.config.get("newest_order_first"));

        // New orders: SortOrder=Oldest, so created_date advances forward monotonically.
        LOGGER.log(Level.INFO, "syncing new ShipBob orders; start_date=" + state.getNew());
        int page = 1;
        while (true) {
            List<JSONObject> orders;
            try {
                orders = deps.shipBob.newOrdersPage(newCursor, page);
            } catch (RuntimeException e) {
                cancel.run();
                throw e;
            }
            if (orders.isEmpty()) {
                break;
            }
            for (JSONObject order : orders) {
                LOGGER.log(Level.INFO, "processing new order; order_id=" + order.opt("id"));
                processOrder(order, deps.gorgias, cache, newestFirst);
                // created_date is YYYY-MM-DDThh:mm:ss.sssssss+00:00; trim to 26 chars for a
                // valid (naive, microsecond) date-time.
                String created = order.optString("created_date", "");
                if (!created.isEmpty()) {
                    state.setNew(Util.trimTo(created, 26));
                }
            }
            page++;
        }

        // Updated orders: keyed off shipment last_update_at (see ShipBobApi.updatedOrdersPage).
        LOGGER.log(Level.INFO, "syncing updated ShipBob orders; start_date=" + state.getUpdated());
        page = 1;
        // Each page is sorted newest-first, but pages are not sorted relative to each other,
        // so the cursor is the minimum across every processed order - not whatever the last
        // order of the last page happened to carry. Kept in a local variable, not
        // CursorState, until the loop ends: every update date is, by construction, later than
        // the starting cursor, so folding that in would pin the cursor there forever, and a
        // partial minimum would sit newer than the pages still unread.
        OffsetDateTime oldestUpdate = null;
        while (true) {
            List<JSONObject> orders;
            try {
                orders = deps.shipBob.updatedOrdersPage(updatedCursor, page);
            } catch (RuntimeException e) {
                cancel.run();
                throw e;
            }
            if (orders.isEmpty()) {
                break;
            }
            for (JSONObject order : orders) {
                LOGGER.log(Level.INFO, "processing updated order; order_id=" + order.opt("id"));
                processOrder(order, deps.gorgias, cache, newestFirst);
                OffsetDateTime updateDate = deps.shipBob.updateDate(order, updatedCursor);
                if (oldestUpdate == null || updateDate.isBefore(oldestUpdate)) {
                    oldestUpdate = updateDate;
                }
            }
            page++;
        }

        // Every page is in, so the minimum is final and safe to resume from.
        if (oldestUpdate != null) {
            state.setUpdated(formatCursor(oldestUpdate));
        }

        cancel.run(); // made it - no timeout to flush
        return state.snapshot();
    }
}
