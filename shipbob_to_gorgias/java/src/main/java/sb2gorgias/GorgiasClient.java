package sb2gorgias;

import org.json.JSONObject;

/** What Cron/Webhook depend on for network calls - satisfied by GorgiasApi and, in tests, by
 * a fake. */
interface GorgiasClient {
    JSONObject findCustomer(String email, String externalId); // null = not found

    long createCustomer(JSONObject payload);

    void updateCustomer(long id, JSONObject payload);

    JSONObject createTicket(JSONObject payload);
}
