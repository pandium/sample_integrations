package sb2gorgias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class WebhookTest {

    private record RunResult(JSONObject result, FakeGorgiasClient gorgias) {
    }

    private static RunResult run(Path tmpDir, JSONArray triggers, JSONObject metadata, String... existingEmails) {
        FakeGorgiasClient gorgias = new FakeGorgiasClient(existingEmails);
        Helpers.PandiumBuilder builder = Helpers.pandium().secrets(Helpers.GORGIAS_SECRETS)
                .runTriggers(triggers).runMode("webhook").tmpDir(tmpDir);
        if (metadata != null) {
            builder.metadata(metadata);
        }
        JSONObject result = Webhook.runWebhook(builder.build(), gorgias, OffsetDateTime.now(ZoneOffset.UTC));
        return new RunResult(result, gorgias);
    }

    @Test
    void runOpensTicketAndWritesOnlyProcessedEvents(@TempDir Path tmpDir) {
        JSONArray triggers = new JSONArray().put(Helpers.webhookTrigger(tmpDir, Helpers.makeShipmentEvent(456789), "t1"));
        RunResult r = run(tmpDir, triggers, null, "jane@example.com");

        JSONObject ticket = r.gorgias().ticketLog.get(0);
        assertEquals(40, ticket.getJSONObject("customer").getLong("id")); // linked to the found customer
        JSONArray expectedTags = new JSONArray()
                .put(new JSONObject().put("name", "shipbob-shipment"))
                .put(new JSONObject().put("name", "shipbob-delivered"));
        assertTrue(expectedTags.similar(ticket.getJSONArray("tags")));
        String bodyText = ticket.getJSONArray("messages").getJSONObject(0).getString("body_text");
        assertTrue(bodyText.contains("is now Delivered"));
        assertTrue(bodyText.contains("USPS 9400100000000000000000"));
        assertEquals(Set.of("processed_events"), r.result().keySet()); // leaves the cron flow's cursor keys alone
        assertTrue(r.result().getJSONObject("processed_events").has("456789:Delivered"));
    }

    @Test
    void runDedupesWithinBatchAndPrunesStaleEntries(@TempDir Path tmpDir) {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        JSONArray triggers = new JSONArray()
                .put(Helpers.webhookTrigger(tmpDir, Helpers.makeShipmentEvent(456789), "t1"))
                .put(Helpers.webhookTrigger(tmpDir, Helpers.makeShipmentEvent(456789), "t2")); // duplicate
        JSONObject metadata = new JSONObject().put("processed_events", new JSONObject()
                // recent -> kept
                .put("456790:Delivered", now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                // >30 min -> pruned
                .put("999999:Delivered", now.minusMinutes(45).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)));
        RunResult r = run(tmpDir, triggers, metadata, "jane@example.com");

        assertEquals(1, r.gorgias().ticketLog.size()); // one ticket despite the duplicate delivery
        assertEquals(Set.of("456789:Delivered", "456790:Delivered"), r.result().getJSONObject("processed_events").keySet());
    }

    /** Dedupe is per shipment and status: a redelivery is dropped, a genuine next status for
     * the same shipment still opens its own ticket. */
    @Test
    void runTicketsEveryStatusButNotTheSameOneTwice(@TempDir Path tmpDir) {
        JSONArray triggers = new JSONArray()
                .put(Helpers.webhookTrigger(tmpDir, Helpers.makeShipmentEvent(1, "OnHold", "jane@example.com", null), "t1"))
                .put(Helpers.webhookTrigger(tmpDir, Helpers.makeShipmentEvent(1, "OnHold", "jane@example.com", null), "t2"))
                .put(Helpers.webhookTrigger(tmpDir, Helpers.makeShipmentEvent(1, "Delivered", "jane@example.com", null), "t3"));
        RunResult r = run(tmpDir, triggers, null, "jane@example.com");

        assertEquals(2, r.gorgias().ticketLog.size());
        assertEquals(Set.of("1:OnHold", "1:Delivered"), r.result().getJSONObject("processed_events").keySet());
    }

    @Test
    void runCreatesCustomerByExternalIdWhenRecipientHasNoEmail(@TempDir Path tmpDir) {
        JSONArray triggers = new JSONArray().put(Helpers.webhookTrigger(tmpDir, Helpers.makeOnholdEvent(), "t1"));
        RunResult r = run(tmpDir, triggers, null, "jane@example.com");

        JSONObject created = r.gorgias().createLog.get(0);
        assertFalse(created.has("email"));
        // the synthetic key the cron flow uses too: name address1 city country
        assertEquals("Jane Buyer 100 Nowhere Blvd Gotham City US", created.getString("external_id"));

        JSONObject ticket = r.gorgias().ticketLog.get(0);
        assertEquals(1001, ticket.getJSONObject("customer").getLong("id")); // the customer we just created
        String body = ticket.getJSONArray("messages").getJSONObject(0).getString("body_text");
        assertTrue(body.contains("is now OnHold"));
        assertTrue(body.contains("Reason: Invalid Address; Payment Failure"));
        assertFalse(body.contains("Tracking:")); // OnHold shipments carry none
        assertTrue(body.contains("4 x Pinnacle Shampoo (PIN-100)"));
        assertEquals(Set.of("107414278:OnHold"), r.result().getJSONObject("processed_events").keySet());
    }
}
