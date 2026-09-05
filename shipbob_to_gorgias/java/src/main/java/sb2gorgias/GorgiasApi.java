package sb2gorgias;

import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;

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
    private static final Logger LOGGER = Pandium.newLogger("gorgias");

    // Mirrors the check the older integration used, so a recipient email found here is one
    // Gorgias would actually accept.
    private static final Pattern EMAIL_RE = Pattern.compile(
            "([-!#-'*+/-9=?A-Z^-~]+(\\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([\\]!#-\\[^-~ \\t]|(\\\\[\\t -~]))+\")"
            + "@([-!#-'*+/-9=?A-Z^-~]+(\\.[-!#-'*+/-9=?A-Z^-~]+)*|\\[[\\t -Z^-~]*])"
    );

    // Captures the date/time portion of a ShipBob ISO timestamp, ignoring the fractional
    // seconds and offset entirely. Works on the raw string instead of a full parse, since
    // ShipBob timestamps are UTC-only - there is no timezone to convert, and this is a
    // display-only format for the customer sidebar.
    private static final Pattern ISO_RE = Pattern.compile("^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})");

    final String apiUrl;
    final HttpClient httpClient;

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
        this.httpClient = new HttpClient(apiUrl, tokenType + " " + token, Duration.ofSeconds(2),
                Set.of("GET", "POST", "PUT"));
    }

    /** Looks a customer up by email or externalId and returns the detail record (so callers
     * can read data), or null if not found. A given email/externalId maps to at most one
     * customer, so no pagination is needed. */
    @Override
    public JSONObject findCustomer(String email, String externalId) {
        LOGGER.log(Level.INFO, "looking for gorgias customer: " + email + ", " + externalId);
        Map<String, String> query;
        if (email != null && !email.isEmpty()) {
            query = Map.of("email", email.toLowerCase());
        } else if (externalId != null && !externalId.isEmpty()) {
            query = Map.of("external_id", externalId);
        } else {
            return null;
        }

        Object res = httpClient.get("/customers", query);
        JSONObject body = res instanceof JSONObject j ? j : new JSONObject();
        JSONArray rows = body.optJSONArray("data");
        if (rows == null || rows.isEmpty()) {
            LOGGER.log(Level.INFO, "Customer not found");
            return null;
        }

        JSONObject first = rows.optJSONObject(0);
        Object id = first == null ? null : first.opt("id");
        Object detail = httpClient.get("/customers/" + id, null);
        LOGGER.log(Level.INFO, "Customer found");
        return detail instanceof JSONObject j ? j : null;
    }

    @Override
    public long createCustomer(JSONObject payload) {
        LOGGER.log(Level.INFO, "creating new gorgias customer");
        Object res;
        try {
            res = httpClient.post("/customers", payload);
        } catch (RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Create customer failed: " + e.getMessage());
            throw e;
        }
        LOGGER.log(Level.INFO, "Customer created successfully");
        return res instanceof JSONObject j ? j.optLong("id") : 0;
    }

    @Override
    public void updateCustomer(long id, JSONObject payload) {
        LOGGER.log(Level.INFO, "updating gorgias customer " + id);
        try {
            httpClient.put("/customers/" + id, payload);
        } catch (RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Update customer " + id + " failed: " + e.getMessage());
            throw e;
        }
        LOGGER.log(Level.INFO, "customer updated");
    }

    @Override
    public JSONObject createTicket(JSONObject payload) {
        LOGGER.log(Level.INFO, "creating gorgias ticket");
        Object res;
        try {
            res = httpClient.post("/tickets", payload);
        } catch (RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Create ticket failed: " + e.getMessage());
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

    /** The key identifying an order's customer: a valid recipient email when present,
     * otherwise a synthetic "name address1 city country". */
    static String customerKey(JSONObject order) {
        String email = validEmail(Util.asString(Util.deepGet(order, "recipient.email", "")));
        if (!email.isEmpty()) {
            return email;
        }
        Object addressObj = Util.deepGet(order, "recipient.address", new JSONObject());
        JSONObject address = addressObj instanceof JSONObject a ? a : new JSONObject();
        return String.join(" ",
                Util.asString(Util.deepGet(order, "recipient.name", "")),
                Util.asString(Util.deepGet(address, "address1", "")),
                Util.asString(Util.deepGet(address, "city", "")),
                Util.asString(Util.deepGet(address, "country", ""))
        );
    }

    /** Body for POST /customers when the customer does not yet exist. */
    static JSONObject newCustomerPayload(JSONObject order, String key) {
        JSONObject payload = new JSONObject();
        payload.put("name", Util.deepGet(order, "recipient.name", ""));
        payload.put("external_id", key);
        payload.put("data", new JSONObject().put("pandium", new JSONObject().put("shipbob_orders", new JSONArray())));
        String email = validEmail(Util.asString(Util.deepGet(order, "recipient.email", "")));
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
        Matcher m = ISO_RE.matcher(value);
        if (!m.find()) {
            return value;
        }
        return String.format("%s/%s/%s %s:%s:%s UTC", m.group(3), m.group(2), m.group(1), m.group(4), m.group(5),
                m.group(6));
    }
}
