package sb2gorgias;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** The webhook flow: any ShipBob order webhook -> a Gorgias ticket.
 *
 * ShipBob's order-related topics (order_shipped, shipment_delivered, shipment_exception,
 * shipment_onhold, shipment_cancelled) all deliver the same shipment object, differing only in
 * status/status_details. This flow opens a ticket for every one of them, so support sees a
 * shipment the moment it needs attention rather than only once it lands.
 *
 * Each webhook run may carry N debounced deliveries (Pandium bundles triggers that arrive
 * while a run is in flight), so we loop over every trigger. Creating a ticket is not
 * idempotent and ShipBob retries any delivery that doesn't get a 2xx, so we dedupe on
 * shipment_id:status using a processed_events map in tenant metadata, pruned to a 30-minute
 * window. Keying on the status as well as the shipment means a redelivery is suppressed while
 * a genuine next status for the same shipment still opens a ticket.
 *
 * Because tenant metadata is shallow-merged at the top level, writing the whole
 * processed_events object replaces the previous one (dropped keys are really removed) while
 * leaving the cron flow's cursor keys untouched.
 *
 * Pandium verifies each delivery's signature before it ever reaches a run, so the bodies
 * handed to this file are already known to have come from ShipBob. */
final class Webhook {
    private static final Logger LOGGER = Pandium.newLogger("webhook");

    private static final Duration PRUNE_WINDOW = Duration.ofMinutes(30);
    private static final String SHIPMENT_TAG = "shipbob-shipment";

    private Webhook() {
    }

    /** Drops entries whose timestamp is more than PRUNE_WINDOW old (or unparseable). */
    static Map<String, String> prune(Map<String, String> processed, OffsetDateTime now) {
        Map<String, String> kept = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : processed.entrySet()) {
            Optional<OffsetDateTime> when = Util.parseTimestamp(entry.getValue());
            if (when.isEmpty()) {
                continue; // unparseable -> treat as expired
            }
            if (Duration.between(when.get(), now).compareTo(PRUNE_WINDOW) <= 0) {
                kept.put(entry.getKey(), entry.getValue());
            }
        }
        return kept;
    }

    private static String idString(Object v) {
        return (v == null || v == JSONObject.NULL) ? "" : String.valueOf(v);
    }

    /** ShipBob names the shipment id "id" on the webhook body; older docs and some topics
     * call it "shipment_id". Accept either. */
    static String shipmentId(JSONObject event) {
        String id = idString(Util.deepGet(event, "id", null));
        if (!id.isEmpty()) {
            return id;
        }
        return idString(Util.deepGet(event, "shipment_id", null));
    }

    /** The human-readable reasons ShipBob attached to this status, e.g. "Invalid Address;
     * Payment Failure". Empty for statuses that carry none. */
    static String statusDetails(JSONObject event) {
        Object detailsObj = Util.deepGet(event, "status_details", new JSONArray());
        JSONArray details = detailsObj instanceof JSONArray a ? a : new JSONArray();
        List<String> reasons = new ArrayList<>();
        for (int i = 0; i < details.length(); i++) {
            if (details.opt(i) instanceof JSONObject d) {
                String desc = d.optString("description", "");
                reasons.add(!desc.isEmpty() ? desc : d.optString("name", ""));
            }
        }
        return String.join("; ", reasons);
    }

    /** One line per product on the shipment: "4 x 16 oz. Shampoo (PIN-100)". */
    static String items(JSONObject event) {
        Object productsObj = Util.deepGet(event, "products", new JSONArray());
        JSONArray products = productsObj instanceof JSONArray a ? a : new JSONArray();
        List<String> lines = new ArrayList<>();
        for (int i = 0; i < products.length(); i++) {
            if (!(products.opt(i) instanceof JSONObject product)) {
                continue;
            }
            long quantity = 0;
            if (product.opt("inventory_items") instanceof JSONArray inventoryItems) {
                for (int j = 0; j < inventoryItems.length(); j++) {
                    if (inventoryItems.opt(j) instanceof JSONObject item) {
                        quantity += Util.toLong(item.opt("quantity"));
                    }
                }
            }
            String sku = product.optString("sku", "");
            if (sku.isEmpty()) {
                sku = product.optString("reference_id", "");
            }
            String line = quantity + " x " + product.optString("name", "");
            if (!sku.isEmpty()) {
                line += " (" + sku + ")";
            }
            lines.add(line);
        }
        return String.join("\n", lines);
    }

    /** Builds the POST /tickets payload for a shipment webhook of any status.
     *
     * customerRef is the {id: ...} returned by resolveCustomer. Gorgias wants the customer
     * twice - once as the ticket's owner and once as the sender of its first message - so the
     * same reference goes in both slots. */
    static JSONObject buildTicket(JSONObject event, JSONObject customerRef) {
        String sid = shipmentId(event);
        String orderId = Util.asString(Util.deepGet(event, "order_id", ""));
        String referenceId = Util.asString(Util.deepGet(event, "reference_id", ""));
        if (referenceId.isEmpty()) {
            referenceId = orderId;
        }
        String status = Util.asString(Util.deepGet(event, "status", "Updated"));
        if (status.isEmpty()) {
            status = "Updated";
        }
        String reasons = statusDetails(event);
        String carrier = Util.asString(Util.deepGet(event, "tracking.carrier", ""));
        String trackingNumber = Util.asString(Util.deepGet(event, "tracking.tracking_number", ""));
        String deliveredOn = Util.trimTo(Util.asString(Util.deepGet(event, "delivery_date", "")), 10);

        String headline = "Shipment " + sid + " for order " + referenceId + " is now " + status + ".";

        // Only the parts ShipBob actually sent for this status make it into the body - an
        // OnHold shipment has no tracking, a Delivered one has no status details.
        List<String> lines = new ArrayList<>(List.of(headline));
        if (!reasons.isEmpty()) {
            lines.add("Reason: " + reasons);
        }
        if (!carrier.isEmpty() || !trackingNumber.isEmpty()) {
            lines.add(("Tracking: " + carrier + " " + trackingNumber).trim());
        }
        if (!deliveredOn.isEmpty()) {
            lines.add("Delivered on: " + deliveredOn);
        }
        String itemLines = items(event);
        if (!itemLines.isEmpty()) {
            lines.add("Items:\n" + itemLines);
        }
        String bodyText = String.join("\n", lines);

        List<String> html = new ArrayList<>(List.of("<p>" + headline + "</p>"));
        if (!reasons.isEmpty()) {
            html.add("<p><b>Reason:</b> " + reasons + "</p>");
        }
        if (!carrier.isEmpty() || !trackingNumber.isEmpty()) {
            html.add("<p><b>Tracking:</b> " + carrier + " " + trackingNumber + "</p>");
        }
        if (!itemLines.isEmpty()) {
            StringBuilder li = new StringBuilder("<ul>");
            for (String line : itemLines.split("\n")) {
                li.append("<li>").append(line).append("</li>");
            }
            li.append("</ul>");
            html.add(li.toString());
        }

        JSONObject message = new JSONObject();
        message.put("sender", customerRef);
        message.put("channel", "api");
        message.put("via", "api");
        message.put("from_agent", false);
        message.put("subject", "Order " + referenceId + ": shipment " + status);
        message.put("body_text", bodyText);
        message.put("body_html", String.join("", html));
        // Included so Gorgias auto-reply / keyword rules can fire.
        message.put("stripped_text", headline);

        JSONObject ticket = new JSONObject();
        ticket.put("customer", customerRef);
        ticket.put("channel", "api");
        ticket.put("via", "api");
        ticket.put("from_agent", false);
        ticket.put("status", "open");
        ticket.put("messages", new JSONArray(List.of(message)));
        // A constant tag to find every ticket this flow opened, plus the status so Gorgias
        // rules can route (e.g. OnHold) without parsing the body.
        ticket.put("tags", new JSONArray(List.of(
                new JSONObject().put("name", SHIPMENT_TAG),
                new JSONObject().put("name", "shipbob-" + status.toLowerCase().replace(" ", "-"))
        )));
        return ticket;
    }

    /** Finds-or-creates the Gorgias customer for a shipment's recipient and returns the
     * reference to attach the ticket to.
     *
     * Uses the same key the cron flow does - a valid recipient email when there is one,
     * otherwise the synthetic name address1 city country - so a webhook ticket lands on the
     * same record that carries the customer's order history. Recipient email is optional on a
     * ShipBob shipment, so the external_id path carries as much weight here as it does in the
     * cron flow. */
    static JSONObject resolveCustomer(GorgiasClient gorgias, JSONObject event) {
        String email = GorgiasApi.validEmail(Util.asString(Util.deepGet(event, "recipient.email", "")));
        String key = GorgiasApi.customerKey(event);

        JSONObject existing = gorgias.findCustomer(email.isEmpty() ? null : email, email.isEmpty() ? key : null);
        if (existing != null) {
            return new JSONObject().put("id", existing.opt("id"));
        }
        long newId = gorgias.createCustomer(GorgiasApi.newCustomerPayload(event, key));
        return new JSONObject().put("id", newId);
    }

    static JSONObject webhookRun(Pandium pandium) {
        GorgiasApi gorgias = new GorgiasApi(pandium);
        return runWebhook(pandium, gorgias, OffsetDateTime.now(ZoneOffset.UTC));
    }

    static JSONObject runWebhook(Pandium pandium, GorgiasClient gorgias, OffsetDateTime now) {
        JSONObject metadata = pandium.metadata();
        if (metadata == null) {
            metadata = new JSONObject();
        }
        Map<String, String> processedRaw = new LinkedHashMap<>();
        if (metadata.opt("processed_events") instanceof JSONObject processedEvents) {
            for (String k : processedEvents.keySet()) {
                processedRaw.put(k, Util.asString(processedEvents.opt(k)));
            }
        }
        Map<String, String> processed = prune(processedRaw, now);

        String nowIso = now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        int created = 0;

        // Pandium bundles debounced deliveries into one run; Pandium.webhookDeliveries reads
        // each raw body back off disk so this loop only has to deal with the event itself.
        for (WebhookDelivery delivery : pandium.webhookDeliveries()) {
            JSONObject event;
            try {
                event = new JSONObject(delivery.body());
            } catch (JSONException e) {
                LOGGER.log(Level.SEVERE, "webhook delivery is not valid JSON; delivery_id=" + delivery.id()
                        + " error=" + e.getMessage());
                continue;
            }

            String sid = shipmentId(event);
            if (sid.isEmpty()) {
                LOGGER.log(Level.WARNING, "webhook delivery has no shipment id; skipping; delivery_id=" + delivery.id());
                continue;
            }

            // Every order webhook gets a ticket, whatever the status - the status is only
            // part of the dedupe key, never a filter.
            String status = Util.asString(Util.deepGet(event, "status", "Updated"));
            if (status.isEmpty()) {
                status = "Updated";
            }
            String eventKey = sid + ":" + status;
            if (processed.containsKey(eventKey)) {
                LOGGER.log(Level.INFO, "shipment already ticketed; skipping duplicate; shipment_id=" + sid
                        + " status=" + status);
                continue;
            }

            JSONObject customerRef;
            try {
                customerRef = resolveCustomer(gorgias, event);
            } catch (RuntimeException e) {
                LOGGER.log(Level.SEVERE, "could not resolve a Gorgias customer for shipment; shipment_id=" + sid
                        + " error=" + e.getMessage());
                continue; // leave unprocessed so ShipBob's retry can try again
            }

            JSONObject ticket;
            try {
                ticket = gorgias.createTicket(buildTicket(event, customerRef));
            } catch (RuntimeException e) {
                LOGGER.log(Level.SEVERE, "failed to open ticket for shipment; shipment_id=" + sid
                        + " error=" + e.getMessage());
                continue; // leave unprocessed so ShipBob's retry can try again
            }

            processed.put(eventKey, nowIso); // mark handled
            created++;
            LOGGER.log(Level.INFO, "opened Gorgias ticket for shipment; ticket_id=" + ticket.opt("id")
                    + " shipment_id=" + sid + " status=" + status);
        }

        LOGGER.log(Level.INFO, "webhook flow complete; tickets_opened=" + created + " events_tracked=" + processed.size());
        // Replaces the map (30-min pruned); shallow merge leaves the cron flow's cursor keys intact.
        JSONObject processedAny = new JSONObject();
        for (Map.Entry<String, String> entry : processed.entrySet()) {
            processedAny.put(entry.getKey(), entry.getValue());
        }
        JSONObject result = new JSONObject();
        result.put("processed_events", processedAny);
        return result;
    }
}
