package main

import (
	"reflect"
	"sort"
	"strings"
	"testing"
	"time"
)

func runWebhookTest(t *testing.T, dir string, triggers []map[string]any, metadata map[string]any, existing []string) (map[string]any, *RecordingGorgias) {
	t.Helper()
	if existing == nil {
		existing = []string{"jane@example.com"}
	}
	gorgias := newRecordingGorgias(existing...)
	opts := testPandiumOpts{secrets: gorgiasSecrets, runTriggers: triggers, runMode: "webhook", tmpDir: dir}
	if metadata != nil {
		opts.metadata = metadata
	}
	pandium := newTestPandium(t, opts)
	result, err := runWebhook(pandium, gorgias, time.Now())
	if err != nil {
		t.Fatal(err)
	}
	return result, gorgias
}

func sortedKeys(m map[string]any) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

func TestRun_OpensTicketAndReturnsOnlyProcessedEvents(t *testing.T) {
	dir := t.TempDir()
	triggers := []map[string]any{webhookTrigger(t, dir, makeShipmentEvent(456789, "Delivered", "jane@example.com", nil), "t1")}
	result, gorgias := runWebhookTest(t, dir, triggers, nil, nil)

	ticket := gorgias.Log.ticket[0]
	customer, _ := ticket["customer"].(map[string]any)
	if toFloat64(customer["id"]) != 40 { // linked to the found customer
		t.Errorf("ticket customer id = %v, want 40", customer["id"])
	}
	tags, _ := ticket["tags"].([]any)
	wantTags := []any{map[string]any{"name": "shipbob-shipment"}, map[string]any{"name": "shipbob-delivered"}}
	if !reflect.DeepEqual(tags, wantTags) {
		t.Errorf("tags = %v, want %v", tags, wantTags)
	}
	messages, _ := ticket["messages"].([]any)
	msg, _ := messages[0].(map[string]any)
	bodyText := asString(msg["body_text"])
	if !strings.Contains(bodyText, "is now Delivered") {
		t.Errorf("body_text missing status: %q", bodyText)
	}
	if !strings.Contains(bodyText, "USPS 9400100000000000000000") {
		t.Errorf("body_text missing tracking: %q", bodyText)
	}

	if got := sortedKeys(result); !reflect.DeepEqual(got, []string{"processed_events"}) { // leaves cron's cursor keys alone
		t.Errorf("result keys = %v, want [processed_events]", got)
	}
	processed, _ := result["processed_events"].(map[string]any)
	if _, ok := processed["456789:Delivered"]; !ok {
		t.Errorf("processed_events missing 456789:Delivered: %v", processed)
	}
}

func TestRun_DedupesWithinBatchAndPrunesStaleEntries(t *testing.T) {
	dir := t.TempDir()
	now := time.Now().UTC()
	triggers := []map[string]any{
		webhookTrigger(t, dir, makeShipmentEvent(456789, "Delivered", "jane@example.com", nil), "t1"),
		webhookTrigger(t, dir, makeShipmentEvent(456789, "Delivered", "jane@example.com", nil), "t2"), // duplicate
	}
	metadata := map[string]any{
		"processed_events": map[string]any{
			"456790:Delivered": now.Format(time.RFC3339),                        // recent -> kept
			"999999:Delivered": now.Add(-45 * time.Minute).Format(time.RFC3339), // >30 min -> pruned
		},
	}
	result, gorgias := runWebhookTest(t, dir, triggers, metadata, nil)

	if len(gorgias.Log.ticket) != 1 { // one ticket despite the duplicate delivery
		t.Errorf("ticket count = %d, want 1", len(gorgias.Log.ticket))
	}
	processed, _ := result["processed_events"].(map[string]any)
	if got := sortedKeys(processed); !reflect.DeepEqual(got, []string{"456789:Delivered", "456790:Delivered"}) {
		t.Errorf("processed_events keys = %v", got)
	}
}

func TestRun_TicketsEveryStatusButNotTheSameOneTwice(t *testing.T) {
	// Dedupe is per shipment and status: a redelivery is dropped, a genuine next
	// status for the same shipment still opens its own ticket.
	dir := t.TempDir()
	triggers := []map[string]any{
		webhookTrigger(t, dir, makeShipmentEvent(1, "OnHold", "jane@example.com", nil), "t1"),
		webhookTrigger(t, dir, makeShipmentEvent(1, "OnHold", "jane@example.com", nil), "t2"),
		webhookTrigger(t, dir, makeShipmentEvent(1, "Delivered", "jane@example.com", nil), "t3"),
	}
	result, gorgias := runWebhookTest(t, dir, triggers, nil, nil)

	if len(gorgias.Log.ticket) != 2 {
		t.Errorf("ticket count = %d, want 2", len(gorgias.Log.ticket))
	}
	processed, _ := result["processed_events"].(map[string]any)
	if got := sortedKeys(processed); !reflect.DeepEqual(got, []string{"1:Delivered", "1:OnHold"}) {
		t.Errorf("processed_events keys = %v", got)
	}
}

func TestRun_CreatesCustomerByExternalIDWhenNoEmail(t *testing.T) {
	dir := t.TempDir()
	triggers := []map[string]any{webhookTrigger(t, dir, makeOnholdEvent(107414278), "t1")}
	result, gorgias := runWebhookTest(t, dir, triggers, nil, nil)

	created := gorgias.Log.create[0]
	if _, hasEmail := created["email"]; hasEmail {
		t.Errorf("created customer should have no email: %v", created)
	}
	// the synthetic key the cron flow uses too: name address1 city country
	if got := asString(created["external_id"]); got != "Jane Buyer 100 Nowhere Blvd Gotham City US" {
		t.Errorf("external_id = %q", got)
	}

	ticket := gorgias.Log.ticket[0]
	customer, _ := ticket["customer"].(map[string]any)
	if toFloat64(customer["id"]) != 1001 { // the customer we just created
		t.Errorf("ticket customer id = %v, want 1001", customer["id"])
	}
	messages, _ := ticket["messages"].([]any)
	msg, _ := messages[0].(map[string]any)
	body := asString(msg["body_text"])
	if !strings.Contains(body, "is now OnHold") {
		t.Errorf("body missing status: %q", body)
	}
	if !strings.Contains(body, "Reason: Invalid Address; Payment Failure") {
		t.Errorf("body missing reason: %q", body)
	}
	if strings.Contains(body, "Tracking:") { // OnHold shipments carry none
		t.Errorf("body should have no tracking line: %q", body)
	}
	if !strings.Contains(body, "4 x Pinnacle Shampoo (PIN-100)") {
		t.Errorf("body missing items: %q", body)
	}
	processed, _ := result["processed_events"].(map[string]any)
	if got := sortedKeys(processed); !reflect.DeepEqual(got, []string{"107414278:OnHold"}) {
		t.Errorf("processed_events keys = %v", got)
	}
}
