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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** One reason ShipBob attached to a status, e.g. "Invalid Address". */
record StatusDetail(String name, String description) {
    static StatusDetail of(JSONObject json) {
        return new StatusDetail(json.optString("name", ""), json.optString("description", ""));
    }
}

record Tracking(String carrier, String trackingNumber) {
    static Tracking of(JSONObject json) {
        if (json == null) {
            return new Tracking("", "");
        }
        return new Tracking(json.optString("carrier", ""), json.optString("tracking_number", ""));
    }
}

record InventoryItem(long quantity) {
    static InventoryItem of(JSONObject json) {
        return new InventoryItem(Util.toLong(json.opt("quantity")));
    }
}

record Product(String name, String sku, String referenceId, List<InventoryItem> inventoryItems) {
    static Product of(JSONObject json) {
        List<InventoryItem> items = new ArrayList<>();
        JSONArray raw = json.optJSONArray("inventory_items");
        if (raw != null) {
            for (int i = 0; i < raw.length(); i++) {
                if (raw.opt(i) instanceof JSONObject o) {
                    items.add(InventoryItem.of(o));
                }
            }
        }
        return new Product(json.optString("name", ""), json.optString("sku", ""),
                json.optString("reference_id", ""), items);
    }

    /** The sku if there is one, else the reference_id. */
    String skuOrReferenceId() {
        return !sku.isEmpty() ? sku : referenceId;
    }
}

/** ShipBob's order-related topics (order_shipped, shipment_delivered, shipment_exception,
 * shipment_onhold, shipment_cancelled) all deliver this same shape, differing only in status
 * and statusDetails. Every field here drives a decision in buildTicket, so it is worth
 * pulling out of the raw JSON once instead of re-reading it ad hoc. */
record ShipmentEvent(
        String shipmentId,
        String orderId,
        String referenceId,
        String status,
        List<StatusDetail> statusDetails,
        Tracking tracking,
        String deliveryDate,
        List<Product> products,
        Recipient recipient) {

    /** ShipBob names the shipment id "id" on the webhook body; older docs and some topics call
     * it "shipment_id". Accept either. */
    private static String idString(Object v) {
        return (v == null || v == JSONObject.NULL) ? "" : String.valueOf(v);
    }

    static ShipmentEvent of(JSONObject json) {
        String id = idString(json.opt("id"));
        String shipmentId = !id.isEmpty() ? id : idString(json.opt("shipment_id"));

        List<StatusDetail> details = new ArrayList<>();
        JSONArray rawDetails = json.optJSONArray("status_details");
        if (rawDetails != null) {
            for (int i = 0; i < rawDetails.length(); i++) {
                if (rawDetails.opt(i) instanceof JSONObject o && !o.isEmpty()) {
                    details.add(StatusDetail.of(o));
                }
            }
        }

        List<Product> products = new ArrayList<>();
        JSONArray rawProducts = json.optJSONArray("products");
        if (rawProducts != null) {
            for (int i = 0; i < rawProducts.length(); i++) {
                if (rawProducts.opt(i) instanceof JSONObject o) {
                    products.add(Product.of(o));
                }
            }
        }

        String status = json.optString("status", "");
        return new ShipmentEvent(
                shipmentId,
                json.optString("order_id", ""),
                json.optString("reference_id", ""),
                status.isEmpty() ? "Updated" : status,
                details,
                Tracking.of(json.optJSONObject("tracking")),
                json.optString("delivery_date", ""),
                products,
                GorgiasApi.recipientOf(json));
    }

    /** The merchant's own order reference, falling back to ShipBob's order id. */
    String orderReference() {
        return !referenceId.isEmpty() ? referenceId : orderId;
    }

    /** The human-readable reasons ShipBob attached to this status, e.g. "Invalid Address;
     * Payment Failure". Empty for statuses that carry none. */
    String statusDetailsText() {
        List<String> reasons = new ArrayList<>();
        for (StatusDetail detail : statusDetails) {
            reasons.add(!detail.description().isEmpty() ? detail.description() : detail.name());
        }
        return String.join("; ", reasons);
    }

    /** One line per product on the shipment: "4 x 16 oz. Shampoo (PIN-100)". */
    String itemsText() {
        List<String> lines = new ArrayList<>();
        for (Product product : products) {
            long quantity = 0;
            for (InventoryItem item : product.inventoryItems()) {
                quantity += item.quantity();
            }
            String sku = product.skuOrReferenceId();
            String line = quantity + " x " + product.name();
            if (!sku.isEmpty()) {
                line += " (" + sku + ")";
            }
            lines.add(line);
        }
        return String.join("\n", lines);
    }
}

/** The webhook flow: any ShipBob order webhook -> a Gorgias ticket.
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
    private static final Logger LOGGER = LoggerFactory.getLogger("webhook");

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

    /** Builds the POST /tickets payload for a shipment webhook of any status.
     *
     * customerRef is the {id: ...} returned by resolveCustomer. Gorgias wants the customer
     * twice - once as the ticket's owner and once as the sender of its first message - so the
     * same reference goes in both slots. */
    static JSONObject buildTicket(ShipmentEvent event, JSONObject customerRef) {
        String reasons = event.statusDetailsText();
        Tracking tracking = event.tracking();
        String deliveredOn = Util.trimTo(event.deliveryDate(), 10);

        String headline = "Shipment " + event.shipmentId() + " for order " + event.orderReference() + " is now "
                + event.status() + ".";

        // Only the parts ShipBob actually sent for this status make it into the body - an
        // OnHold shipment has no tracking, a Delivered one has no status details.
        List<String> lines = new ArrayList<>(List.of(headline));
        if (!reasons.isEmpty()) {
            lines.add("Reason: " + reasons);
        }
        if (!tracking.carrier().isEmpty() || !tracking.trackingNumber().isEmpty()) {
            lines.add(("Tracking: " + tracking.carrier() + " " + tracking.trackingNumber()).trim());
        }
        if (!deliveredOn.isEmpty()) {
            lines.add("Delivered on: " + deliveredOn);
        }
        String itemLines = event.itemsText();
        if (!itemLines.isEmpty()) {
            lines.add("Items:\n" + itemLines);
        }
        String bodyText = String.join("\n", lines);

        List<String> html = new ArrayList<>(List.of("<p>" + headline + "</p>"));
        if (!reasons.isEmpty()) {
            html.add("<p><b>Reason:</b> " + reasons + "</p>");
        }
        if (!tracking.carrier().isEmpty() || !tracking.trackingNumber().isEmpty()) {
            html.add("<p><b>Tracking:</b> " + tracking.carrier() + " " + tracking.trackingNumber() + "</p>");
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
        message.put("subject", "Order " + event.orderReference() + ": shipment " + event.status());
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
                new JSONObject().put("name", "shipbob-" + event.status().toLowerCase().replace(" ", "-"))
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
    static JSONObject resolveCustomer(GorgiasClient gorgias, ShipmentEvent event) {
        Recipient recipient = event.recipient();
        String email = GorgiasApi.validEmail(recipient.email());
        String key = GorgiasApi.customerKey(recipient);

        JSONObject existing = gorgias.findCustomer(email.isEmpty() ? null : email, email.isEmpty() ? key : null);
        if (existing != null) {
            return new JSONObject().put("id", existing.get("id"));
        }
        long newId = gorgias.createCustomer(GorgiasApi.newCustomerPayload(recipient, key));
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
            ShipmentEvent event;
            try {
                event = ShipmentEvent.of(new JSONObject(delivery.body()));
            } catch (JSONException e) {
                LOGGER.error("webhook delivery is not valid JSON; delivery_id={}", delivery.id(), e);
                continue;
            }

            if (event.shipmentId().isEmpty()) {
                LOGGER.warn("webhook delivery has no shipment id; skipping; delivery_id={}", delivery.id());
                continue;
            }

            // Every order webhook gets a ticket, whatever the status - the status is only
            // part of the dedupe key, never a filter.
            String eventKey = event.shipmentId() + ":" + event.status();
            if (processed.containsKey(eventKey)) {
                LOGGER.info("shipment already ticketed; skipping duplicate; shipment_id={} status={}",
                        event.shipmentId(), event.status());
                continue;
            }

            JSONObject customerRef;
            try {
                customerRef = resolveCustomer(gorgias, event);
            } catch (RuntimeException e) {
                LOGGER.error("could not resolve a Gorgias customer for shipment; shipment_id={}",
                        event.shipmentId(), e);
                continue; // leave unprocessed so ShipBob's retry can try again
            }

            JSONObject ticket;
            try {
                ticket = gorgias.createTicket(buildTicket(event, customerRef));
            } catch (RuntimeException e) {
                LOGGER.error("failed to open ticket for shipment; shipment_id={}", event.shipmentId(), e);
                continue; // leave unprocessed so ShipBob's retry can try again
            }

            processed.put(eventKey, nowIso); // mark handled
            created++;
            LOGGER.info("opened Gorgias ticket for shipment; ticket_id={} shipment_id={} status={}",
                    ticket.opt("id"), event.shipmentId(), event.status());
        }

        LOGGER.info("webhook flow complete; tickets_opened={} events_tracked={}", created, processed.size());
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
