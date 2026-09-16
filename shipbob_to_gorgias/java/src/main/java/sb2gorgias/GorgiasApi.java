package sb2gorgias;

import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Who a ShipBob order or shipment event ships to. Both flows key their Gorgias customer off
 * this. */
record Recipient(String name, String email, Address address) {
}

record Address(String address1, String city, String country) {
}

/** Gorgias API client.
 *
 * The cron flow upserts customers (writing ShipBob order history to
 * data.pandium.shipbob_orders); the webhook flow creates tickets.
 *
 * Auth is OAuth2 via Pandium's gorgias-oauth connector. Pandium runs the authorization flow
 * when the tenant connects and refreshes the token on its own schedule, so this client never
 * sees a client secret, never posts to a token endpoint, and holds no refresh logic - it reads
 * whatever access token is current for this run and sends it as a bearer token. A refresh that
 * fails is a platform concern and surfaces as Failed (Refresh) on the run, not as an error this
 * code has to handle. */
final class GorgiasApi implements GorgiasClient {
    private static final Logger LOGGER = LoggerFactory.getLogger("gorgias");

    // Only a recipient email Gorgias would actually accept counts as valid.
    private static final Pattern EMAIL_RE = Pattern.compile(
            "([-!#-'*+/-9=?A-Z^-~]+(\\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([\\]!#-\\[^-~ \\t]|(\\\\[\\t -~]))+\")"
            + "@([-!#-'*+/-9=?A-Z^-~]+(\\.[-!#-'*+/-9=?A-Z^-~]+)*|\\[[\\t -Z^-~]*])"
    );

    private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss 'UTC'");

    final String apiUrl;
    final ApiClient apiClient;

    GorgiasApi(Pandium pandium) {
        Map<String, String> secrets = pandium.secrets;
        String token = secrets.get("gorgias_oauth_access_token");
        String account = secrets.get("gorgias_oauth_account");
        if (token == null || token.isEmpty() || account == null || account.isEmpty()) {
            throw new IllegalStateException(
                    "PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN and PAN_SEC_GORGIAS_OAUTH_ACCOUNT are required");
        }
        this.apiUrl = "https://" + account.toLowerCase() + ".gorgias.com/api";
        // The connector reports its own scheme; every current Gorgias token is a bearer.
        String tokenType = secrets.get("gorgias_oauth_token_type");
        if (tokenType == null || tokenType.isEmpty()) {
            tokenType = "Bearer";
        }
        // Exponential backoff: 2s, 4s, 8s, ... GET/POST/PUT are all retried.
        this.apiClient = new ApiClient(apiUrl, tokenType + " " + token, Duration.ofSeconds(2),
                Set.of("GET", "POST", "PUT"));
    }

    /** Looks a customer up by email or externalId and returns the detail record (so callers
     * can read data), or null if not found. A given email/externalId maps to at most one
     * customer, so no pagination is needed. */
    @Override
    public JSONObject findCustomer(String email, String externalId) {
        LOGGER.info("looking for gorgias customer: {}, {}", email, externalId);
        Map<String, String> query;
        if (email != null && !email.isEmpty()) {
            query = Map.of("email", email.toLowerCase());
        } else if (externalId != null && !externalId.isEmpty()) {
            query = Map.of("external_id", externalId);
        } else {
            return null;
        }

        Object res = apiClient.get("/customers", query);
        JSONObject body = res instanceof JSONObject j ? j : new JSONObject();
        JSONArray rows = body.optJSONArray("data");
        if (rows == null || rows.isEmpty()) {
            LOGGER.info("customer not found");
            return null;
        }

        JSONObject first = rows.optJSONObject(0);
        if (first == null || !first.has("id") || first.isNull("id")) {
            throw new IllegalStateException("Gorgias customer has no id");
        }
        Object detail = apiClient.get("/customers/" + first.get("id"), null);
        LOGGER.info("customer found");
        return detail instanceof JSONObject j ? j : null;
    }

    @Override
    public long createCustomer(JSONObject payload) {
        LOGGER.info("creating new gorgias customer");
        Object res;
        try {
            res = apiClient.post("/customers", payload);
        } catch (RuntimeException e) {
            LOGGER.error("create customer failed", e);
            throw e;
        }
        if (!(res instanceof JSONObject j) || !j.has("id") || j.isNull("id")) {
            throw new IllegalStateException("Gorgias created a customer without an id");
        }
        LOGGER.info("customer created successfully");
        return j.optLong("id");
    }

    @Override
    public void updateCustomer(long id, JSONObject payload) {
        LOGGER.info("updating gorgias customer {}", id);
        try {
            apiClient.put("/customers/" + id, payload);
        } catch (RuntimeException e) {
            LOGGER.error("update customer {} failed", id, e);
            throw e;
        }
        LOGGER.info("customer updated");
    }

    @Override
    public JSONObject createTicket(JSONObject payload) {
        LOGGER.info("creating gorgias ticket");
        Object res;
        try {
            res = apiClient.post("/tickets", payload);
        } catch (RuntimeException e) {
            LOGGER.error("create ticket failed", e);
            throw e;
        }
        return res instanceof JSONObject j ? j : new JSONObject();
    }

    /** Returns email if Gorgias would accept it, else "". */
    static String validEmail(String email) {
        if (email != null && !email.isEmpty() && !email.contains(".@") && EMAIL_RE.matcher(email).matches()) {
            return email;
        }
        return "";
    }

    /** Reads the recipient common to both a ShipBob order and a shipment event - same shape,
     * same field names - so both flows can key their Gorgias customer off one extraction. */
    static Recipient recipientOf(JSONObject data) {
        JSONObject recipient = data.optJSONObject("recipient");
        if (recipient == null) {
            return new Recipient("", "", new Address("", "", ""));
        }
        JSONObject address = recipient.optJSONObject("address");
        Address addr = address == null ? new Address("", "", "") : new Address(
                address.optString("address1", ""), address.optString("city", ""), address.optString("country", ""));
        return new Recipient(recipient.optString("name", ""), recipient.optString("email", ""), addr);
    }

    /** The key identifying a recipient's customer: a valid email when present, otherwise a
     * synthetic "name address1 city country". */
    static String customerKey(Recipient recipient) {
        String email = validEmail(recipient.email());
        if (!email.isEmpty()) {
            return email;
        }
        Address address = recipient.address();
        return String.join(" ", recipient.name(), address.address1(), address.city(), address.country());
    }

    /** Body for POST /customers when the customer does not yet exist. */
    static JSONObject newCustomerPayload(Recipient recipient, String key) {
        JSONObject payload = new JSONObject();
        payload.put("name", recipient.name());
        payload.put("external_id", key);
        payload.put("data", new JSONObject().put("pandium", new JSONObject().put("shipbob_orders", new JSONArray())));
        String email = validEmail(recipient.email());
        if (!email.isEmpty()) {
            payload.put("email", email);
        }
        return payload;
    }

    /** The single order entry stored in data.pandium.shipbob_orders. */
    static JSONObject orderDataPayload(JSONObject order) {
        Object shipmentsObj = Util.deepGet(order, "shipments", new JSONArray());
        JSONArray shipments = shipmentsObj instanceof JSONArray a ? a : new JSONArray();
        for (int i = 0; i < shipments.length(); i++) {
            if (shipments.opt(i) instanceof JSONObject shipment) {
                for (String field : new String[] {"estimated_fulfillment_date", "actual_fulfillment_date"}) {
                    String value = shipment.optString(field, "");
                    if (!value.isEmpty()) {
                        shipment.put(field, formatDate(value));
                    }
                }
                Object shipmentId = shipment.opt("id");
                shipment.put("url", "https://web.shipbob.com/App/Merchant/#/Orders/"
                        + (shipmentId == null ? "" : shipmentId) + "/");
            }
        }
        JSONObject payload = new JSONObject();
        payload.put("id", Util.deepGet(order, "id", ""));
        payload.put("created_date", formatDate(Util.asString(Util.deepGet(order, "created_date", ""))));
        payload.put("purchase_date", formatDate(Util.asString(Util.deepGet(order, "purchase_date", ""))));
        payload.put("reference_id", Util.deepGet(order, "reference_id", ""));
        payload.put("order_number", Util.deepGet(order, "order_number", ""));
        payload.put("status", Util.deepGet(order, "status", ""));
        payload.put("type", Util.deepGet(order, "type", ""));
        payload.put("channel", Util.deepGet(order, "channel", new JSONObject()));
        payload.put("shipping_method", Util.deepGet(order, "shipping_method", ""));
        payload.put("recipient", Util.deepGet(order, "recipient", new JSONObject()));
        payload.put("products", Util.deepGet(order, "products", new JSONArray()));
        payload.put("tags", Util.deepGet(order, "tags", new JSONArray()));
        payload.put("shipments", shipments);
        return payload;
    }

    /** Renders a ShipBob ISO timestamp for the customer sidebar; passes through anything
     * unparseable. */
    static String formatDate(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }
        return Util.parseTimestamp(value).map(DISPLAY_DATE::format).orElse(value);
    }
}
