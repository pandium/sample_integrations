package sb2gorgias;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

/** Shared test doubles and factories - nothing here touches the network. */
final class Helpers {
    private Helpers() {
    }

    static final Map<String, String> GORGIAS_SECRETS = Map.of(
            "gorgias_oauth_access_token", "gorgias-token-123",
            "gorgias_oauth_account", "acme"
    );

    /** Builds a Pandium directly (no env). metadata is written to a temp file so
     * pandium.metadata() reads it back like the real thing. */
    static final class PandiumBuilder {
        private Map<String, String> config = Map.of();
        private Map<String, String> secrets = Map.of();
        private JSONArray runTriggers;
        private JSONObject metadata;
        private String runMode;
        private Path tmpDir;

        PandiumBuilder config(Map<String, String> config) {
            this.config = config;
            return this;
        }

        PandiumBuilder secrets(Map<String, String> secrets) {
            this.secrets = secrets;
            return this;
        }

        PandiumBuilder runTriggers(JSONArray runTriggers) {
            this.runTriggers = runTriggers;
            return this;
        }

        PandiumBuilder metadata(JSONObject metadata) {
            this.metadata = metadata;
            return this;
        }

        PandiumBuilder runMode(String runMode) {
            this.runMode = runMode;
            return this;
        }

        PandiumBuilder tmpDir(Path tmpDir) {
            this.tmpDir = tmpDir;
            return this;
        }

        Pandium build() {
            Map<String, String> context = new HashMap<>();
            if (runMode != null) {
                context.put("run_mode", runMode);
            }
            if (runTriggers != null) {
                context.put("run_triggers", runTriggers.toString());
            }
            if (metadata != null) {
                try {
                    Path path = tmpDir.resolve("metadata.json");
                    Files.writeString(path, metadata.toString(), StandardCharsets.UTF_8);
                    context.put("tenant_metadata_file", path.toString());
                } catch (IOException e) {
                    throw new UncheckedIOException(e);
                }
            }
            return new Pandium(config, secrets, context);
        }
    }

    static PandiumBuilder pandium() {
        return new PandiumBuilder();
    }

    static JSONObject makeOrder(long id, String created, String email) {
        return makeOrder(id, created, email, null);
    }

    static JSONObject makeOrder(long id, String created, String email, String lastUpdate) {
        JSONObject recipient = new JSONObject();
        recipient.put("email", email);
        recipient.put("name", "Buyer");
        recipient.put("address", new JSONObject().put("address1", "1 Main St").put("city", "NY").put("country", "US"));

        JSONObject shipment = new JSONObject();
        shipment.put("id", id * 10);
        shipment.put("last_update_at", lastUpdate != null ? lastUpdate : created);

        JSONObject order = new JSONObject();
        order.put("id", id);
        order.put("created_date", created);
        order.put("reference_id", "REF-" + id);
        order.put("recipient", recipient);
        order.put("shipments", new JSONArray().put(shipment));
        return order;
    }

    static JSONObject makeShipmentEvent(long shipmentId) {
        return makeShipmentEvent(shipmentId, "Delivered", "jane@example.com", null);
    }

    /** A ShipBob shipment webhook body. Every order-related topic delivers this same object;
     * status and statusDetails are what vary between them. */
    static JSONObject makeShipmentEvent(long shipmentId, String status, String email, JSONArray statusDetails) {
        JSONObject event = new JSONObject();
        event.put("id", shipmentId);
        event.put("order_id", 289012345L);
        event.put("reference_id", "MERCHANT-ORDER-1001");
        event.put("status", status);
        event.put("status_details", statusDetails != null ? statusDetails : new JSONArray());
        event.put("tracking", new JSONObject().put("carrier", "USPS").put("tracking_number", "9400100000000000000000"));
        event.put("delivery_date", "2026-07-09T18:22:00Z");

        JSONObject inventoryItem = new JSONObject().put("name", "Pinnacle Shampoo").put("quantity", 4);
        JSONObject product = new JSONObject();
        product.put("name", "Pinnacle Shampoo");
        product.put("sku", "PIN-100");
        product.put("inventory_items", new JSONArray().put(inventoryItem));
        event.put("products", new JSONArray().put(product));

        JSONObject recipient = new JSONObject();
        recipient.put("name", "Jane Buyer");
        recipient.put("email", email);
        recipient.put("address", new JSONObject().put("address1", "100 Nowhere Blvd").put("city", "Gotham City")
                .put("country", "US"));
        event.put("recipient", recipient);
        return event;
    }

    static JSONObject makeOnholdEvent() {
        return makeOnholdEvent(107414278L);
    }

    /** An OnHold shipment: status details, no tracking, and no recipient email. */
    static JSONObject makeOnholdEvent(long shipmentId) {
        JSONArray statusDetails = new JSONArray()
                .put(new JSONObject().put("id", 401).put("name", "InvalidAddress").put("description", "Invalid Address"))
                .put(new JSONObject().put("id", 400).put("name", "PaymentDeclined").put("description", "Payment Failure"));
        JSONObject event = makeShipmentEvent(shipmentId, "OnHold", null, statusDetails);
        event.put("tracking", JSONObject.NULL);
        event.put("delivery_date", JSONObject.NULL);
        return event;
    }

    /** Writes an event to disk and wraps it in a trigger, the way Pandium hands one over. */
    static JSONObject webhookTrigger(Path tmpDir, JSONObject event, String tid) {
        return webhookTrigger(tmpDir, event, tid, "webhook");
    }

    static JSONObject webhookTrigger(Path tmpDir, JSONObject event, String tid, String source) {
        try {
            Path path = tmpDir.resolve(tid + ".json");
            Files.writeString(path, event.toString(), StandardCharsets.UTF_8);
            JSONObject trigger = new JSONObject();
            trigger.put("id", tid);
            trigger.put("source", source);
            trigger.put("payload", new JSONObject().put("file", path.toString()));
            return trigger;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
