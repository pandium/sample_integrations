package sb2gorgias;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONObject;

/** ShipBob API client - reads orders for the cron sync.
 *
 * Auth is a single bearer token (PAN_SEC_SHIPBOB_ACCESS_TOKEN). The base URL is resolved from
 * the token's issuer (iss) claim, so the same code targets prod, sandbox, or QA depending on
 * which token the tenant connected. */
final class ShipBobApi implements ShipBobClient {
    private static final Logger LOGGER = Pandium.newLogger("shipbob");

    // ShipBob issues tokens from different auth hosts per environment; map each to its
    // matching API base URL. Anything unrecognized falls back to prod.
    private static final Map<String, String> AUTH_URL_TO_BASE_URL = Map.of(
            "https://authstage.shipbob.com", "https://sandbox-api.shipbob.com/2026-01",
            "https://auth.shipbob.com", "https://api.shipbob.com/2026-01"
    );
    static final String DEFAULT_BASE_URL = "https://api.shipbob.com/2026-01";

    final String apiUrl;
    final HttpClient httpClient;

    ShipBobApi(Pandium pandium) {
        String token = pandium.secrets.get("shipbob_access_token");
        if (token == null || token.isEmpty()) {
            throw new IllegalStateException("PAN_SEC_SHIPBOB_ACCESS_TOKEN is required");
        }
        this.apiUrl = resolveBaseUrl(token);
        // Exponential backoff: 3s, 6s, 12s, ... Only GET is ever called by this client.
        this.httpClient = new HttpClient(apiUrl, "Bearer " + token, Duration.ofSeconds(3), Set.of("GET"));
    }

    /** Decodes the JWT payload and maps its iss claim to an API base URL. */
    static String resolveBaseUrl(String token) {
        try {
            String payload = token.split("\\.")[1];
            payload += "=".repeat((4 - payload.length() % 4) % 4);
            byte[] decoded = Base64.getUrlDecoder().decode(payload);
            JSONObject claims = new JSONObject(new String(decoded, StandardCharsets.UTF_8));
            String iss = claims.optString("iss", null);
            return AUTH_URL_TO_BASE_URL.getOrDefault(iss, DEFAULT_BASE_URL);
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Could not resolve ShipBob base URL from token: " + e.getMessage());
            return DEFAULT_BASE_URL;
        }
    }

    /** GETs one page of /order. Only an exhausted query answers with an empty list. The
     * caller stops paging there and commits its cursor, so a failure - or a 200 carrying
     * something other than a list - throws instead. */
    private List<JSONObject> getOrders(Map<String, String> params) {
        Object data;
        try {
            data = httpClient.get("/order", params);
        } catch (RuntimeException e) {
            LOGGER.log(Level.SEVERE, "ShipBob order fetch failed (" + params + "): " + e.getMessage());
            throw e;
        }
        if (data == null) {
            return List.of();
        }
        if (!(data instanceof JSONArray array)) {
            throw new RuntimeException("ShipBob answered /order (" + params + ") with " + data);
        }
        List<JSONObject> orders = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            if (array.opt(i) instanceof JSONObject order) {
                orders.add(order);
            }
        }
        return orders;
    }

    /** One page of orders created since startDate, oldest first. */
    @Override
    public List<JSONObject> newOrdersPage(OffsetDateTime startDate, int page) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("StartDate", startDate.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        params.put("Page", String.valueOf(page));
        params.put("SortOrder", "Oldest");
        return getOrders(params);
    }

    /** One page of orders updated since startDate.
     *
     * ShipBob puts last_update_at on shipments, not orders, so we derive a per-order update
     * timestamp and sort the page newest-first. Advancing the cursor to the oldest processed
     * update keeps the sync conservative: a timed-out run never skips an update, at the cost
     * of some reprocessing (which is harmless - customer writes are idempotent PUTs). */
    @Override
    public List<JSONObject> updatedOrdersPage(OffsetDateTime startDate, int page) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("LastUpdateStartDate", startDate.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        params.put("Page", String.valueOf(page));
        List<JSONObject> orders = getOrders(params);
        orders.sort(Comparator.comparing((JSONObject order) -> updateDate(order, startDate)).reversed());
        return orders;
    }

    /** The oldest shipment last_update_at on order that still falls after startDate; defaults
     * to now when none qualify. */
    @Override
    public OffsetDateTime updateDate(JSONObject order, OffsetDateTime startDate) {
        OffsetDateTime updateDate = OffsetDateTime.now(ZoneOffset.UTC);
        if (order.opt("shipments") instanceof JSONArray shipments) {
            for (int i = 0; i < shipments.length(); i++) {
                JSONObject shipment = shipments.optJSONObject(i);
                if (shipment == null) {
                    continue;
                }
                String ts = shipment.optString("last_update_at", null);
                if (ts == null || ts.isEmpty()) {
                    continue;
                }
                Optional<OffsetDateTime> parsed = Util.parseTimestamp(ts);
                if (parsed.isPresent() && parsed.get().isAfter(startDate) && parsed.get().isBefore(updateDate)) {
                    updateDate = parsed.get();
                }
            }
        }
        return updateDate;
    }
}
