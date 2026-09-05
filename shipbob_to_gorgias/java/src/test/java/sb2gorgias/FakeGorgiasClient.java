package sb2gorgias;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

/** A GorgiasClient fake with HTTP replaced by in-memory recorders. existingEmails are
 * pre-seeded as found customers; inspect createLog/updateLog/ticketLog in assertions. */
final class FakeGorgiasClient implements GorgiasClient {
    private final Map<String, Long> store = new HashMap<>();
    final List<JSONObject> createLog = new ArrayList<>();
    final List<Map.Entry<Long, JSONObject>> updateLog = new ArrayList<>();
    final List<JSONObject> ticketLog = new ArrayList<>();

    FakeGorgiasClient(String... existingEmails) {
        long id = 40;
        for (String email : existingEmails) {
            store.put(email, id++);
        }
    }

    @Override
    public JSONObject findCustomer(String email, String externalId) {
        String key = email != null ? email : externalId;
        Long id = key == null ? null : store.get(key);
        if (id == null) {
            return null;
        }
        JSONObject customer = new JSONObject();
        customer.put("id", id);
        customer.put("data", new JSONObject().put("pandium", new JSONObject().put("shipbob_orders", new JSONArray())));
        return customer;
    }

    @Override
    public long createCustomer(JSONObject payload) {
        long cid = 1000 + store.size();
        String externalId = payload.optString("external_id", null);
        store.put(externalId != null ? externalId : String.valueOf(cid), cid);
        createLog.add(payload);
        return cid;
    }

    @Override
    public void updateCustomer(long id, JSONObject payload) {
        updateLog.add(new AbstractMap.SimpleEntry<>(id, new JSONObject(payload.toString()))); // snapshot
    }

    @Override
    public JSONObject createTicket(JSONObject payload) {
        ticketLog.add(payload);
        return new JSONObject().put("id", 900 + ticketLog.size());
    }
}
