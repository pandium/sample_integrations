package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestWebhookDeliveries_ReadsBodyFromFile(t *testing.T) {
	dir := t.TempDir()
	file := filepath.Join(dir, "t1.json")
	if err := os.WriteFile(file, []byte(`{"hello":"world"}`), 0o644); err != nil {
		t.Fatal(err)
	}
	triggers := []map[string]any{
		{"id": "t1", "mode": "webhook", "payload": map[string]any{"file": file}},
	}
	b, _ := json.Marshal(triggers)
	pandium := NewPandium(nil, nil, map[string]string{"run_triggers": string(b)})

	deliveries := pandium.WebhookDeliveries()
	if len(deliveries) != 1 {
		t.Fatalf("deliveries = %d, want 1", len(deliveries))
	}
	if deliveries[0].ID != "t1" {
		t.Errorf("ID = %q, want t1", deliveries[0].ID)
	}
	if deliveries[0].Body != `{"hello":"world"}` {
		t.Errorf("Body = %q", deliveries[0].Body)
	}
}

// TestWebhookDeliveries_SkipsUnreadableOrMissingFile is new coverage beyond
// Python's suite (which only exercises the happy path indirectly via
// webhook_trigger) — the file-read failure path is easy to regress silently.
func TestWebhookDeliveries_SkipsUnreadableOrMissingFile(t *testing.T) {
	triggers := []map[string]any{
		{"id": "t1", "mode": "webhook", "payload": map[string]any{"file": "/nonexistent/path.json"}},
		{"id": "t2", "mode": "webhook", "payload": map[string]any{}}, // no file at all
	}
	b, _ := json.Marshal(triggers)
	pandium := NewPandium(nil, nil, map[string]string{"run_triggers": string(b)})

	deliveries := pandium.WebhookDeliveries()
	if len(deliveries) != 0 {
		t.Errorf("deliveries = %v, want none", deliveries)
	}
}
