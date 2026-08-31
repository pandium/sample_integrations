package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"testing"
	"time"
)

var gorgiasSecrets = map[string]string{
	"gorgias_oauth_access_token": "gorgias-token-123",
	"gorgias_oauth_account":      "acme",
}

type testPandiumOpts struct {
	config      map[string]string
	secrets     map[string]string
	runTriggers []map[string]any
	metadata    map[string]any
	runMode     string
	tmpDir      string
}

// newTestPandium builds a Pandium directly (no env). metadata is written to a
// temp file so pandium.Metadata() reads it back like the real thing.
func newTestPandium(t *testing.T, opts testPandiumOpts) *Pandium {
	t.Helper()
	context := map[string]string{}
	if opts.runMode != "" {
		context["run_mode"] = opts.runMode
	}
	if opts.runTriggers != nil {
		b, err := json.Marshal(opts.runTriggers)
		if err != nil {
			t.Fatal(err)
		}
		context["run_triggers"] = string(b)
	}
	if opts.metadata != nil {
		dir := opts.tmpDir
		if dir == "" {
			dir = t.TempDir()
		}
		file := filepath.Join(dir, "metadata.json")
		b, err := json.Marshal(opts.metadata)
		if err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(file, b, 0o644); err != nil {
			t.Fatal(err)
		}
		context["tenant_metadata_file"] = file
	}
	config := opts.config
	if config == nil {
		config = map[string]string{}
	}
	secrets := opts.secrets
	if secrets == nil {
		secrets = map[string]string{}
	}
	return NewPandium(config, secrets, context)
}

type updateRecord struct {
	id      float64
	payload map[string]any
}

type recordingGorgiasLog struct {
	create []map[string]any
	update []updateRecord
	ticket []map[string]any
}

// RecordingGorgias is a GorgiasClient test double: existingEmails are pre-seeded
// as found customers; inspect Log in assertions.
type RecordingGorgias struct {
	store map[string]float64
	Log   recordingGorgiasLog
}

func newRecordingGorgias(existingEmails ...string) *RecordingGorgias {
	r := &RecordingGorgias{store: map[string]float64{}}
	for i, email := range existingEmails {
		r.store[email] = float64(40 + i)
	}
	return r
}

func (r *RecordingGorgias) FindCustomer(email, externalID string) (map[string]any, error) {
	key := email
	if key == "" {
		key = externalID
	}
	id, ok := r.store[key]
	if !ok || key == "" {
		return nil, nil
	}
	return map[string]any{
		"id":   id,
		"data": map[string]any{"pandium": map[string]any{"shipbob_orders": []any{}}},
	}, nil
}

func (r *RecordingGorgias) CreateCustomer(payload map[string]any) (float64, error) {
	id := float64(1000 + len(r.store))
	key := asString(payload["external_id"])
	if key == "" {
		key = fmt.Sprintf("%v", id)
	}
	r.store[key] = id
	r.Log.create = append(r.Log.create, payload)
	return id, nil
}

func (r *RecordingGorgias) UpdateCustomer(id float64, payload map[string]any) error {
	b, _ := json.Marshal(payload) // snapshot
	var snapshot map[string]any
	_ = json.Unmarshal(b, &snapshot)
	r.Log.update = append(r.Log.update, updateRecord{id: id, payload: snapshot})
	return nil
}

func (r *RecordingGorgias) CreateTicket(payload map[string]any) (map[string]any, error) {
	r.Log.ticket = append(r.Log.ticket, payload)
	return map[string]any{"id": float64(900 + len(r.Log.ticket))}, nil
}

func makeOrder(id int, created, email string) map[string]any {
	return makeOrderUpdated(id, created, email, created)
}

func makeOrderUpdated(id int, created, email, lastUpdate string) map[string]any {
	var emailVal any
	if email != "" {
		emailVal = email
	}
	return map[string]any{
		"id":           float64(id),
		"created_date": created,
		"reference_id": fmt.Sprintf("REF-%d", id),
		"recipient": map[string]any{
			"email": emailVal,
			"name":  "Buyer",
			"address": map[string]any{
				"address1": "1 Main St",
				"city":     "NY",
				"country":  "US",
			},
		},
		"shipments": []any{
			map[string]any{"id": float64(id * 10), "last_update_at": lastUpdate},
		},
	}
}

func makeShipmentEvent(shipmentID int, status, email string, statusDetails []any) map[string]any {
	var emailVal any
	if email != "" {
		emailVal = email
	}
	if statusDetails == nil {
		statusDetails = []any{}
	}
	return map[string]any{
		"id":             float64(shipmentID),
		"order_id":       float64(289012345),
		"reference_id":   "MERCHANT-ORDER-1001",
		"status":         status,
		"status_details": statusDetails,
		"tracking":       map[string]any{"carrier": "USPS", "tracking_number": "9400100000000000000000"},
		"delivery_date":  "2026-07-09T18:22:00Z",
		"products": []any{
			map[string]any{
				"name": "Pinnacle Shampoo",
				"sku":  "PIN-100",
				"inventory_items": []any{
					map[string]any{"name": "Pinnacle Shampoo", "quantity": float64(4)},
				},
			},
		},
		"recipient": map[string]any{
			"name":  "Jane Buyer",
			"email": emailVal,
			"address": map[string]any{
				"address1": "100 Nowhere Blvd",
				"city":     "Gotham City",
				"country":  "US",
			},
		},
	}
}

// makeOnholdEvent is an OnHold shipment: status details, no tracking, and no
// recipient email.
func makeOnholdEvent(shipmentID int) map[string]any {
	event := makeShipmentEvent(shipmentID, "OnHold", "", []any{
		map[string]any{"id": float64(401), "name": "InvalidAddress", "description": "Invalid Address"},
		map[string]any{"id": float64(400), "name": "PaymentDeclined", "description": "Payment Failure"},
	})
	event["tracking"] = nil
	event["delivery_date"] = nil
	return event
}

// webhookTrigger writes an event to disk and wraps it in a trigger, the way
// Pandium hands one over.
func webhookTrigger(t *testing.T, dir string, event map[string]any, tid string) map[string]any {
	t.Helper()
	file := filepath.Join(dir, tid+".json")
	b, err := json.Marshal(event)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(file, b, 0o644); err != nil {
		t.Fatal(err)
	}
	return map[string]any{
		"id":      tid,
		"source":  "webhook",
		"mode":    "webhook",
		"payload": map[string]any{"file": file},
	}
}

type pageHalf string

const (
	halfNew     pageHalf = "new"
	halfUpdated pageHalf = "updated"
)

type pageRef struct {
	half pageHalf
	page int
}

// FakeShipBob serves canned pages for either half and records the pages asked
// for. OnPage runs before a page is served, which is where a test stands in for
// the watchdog tripping or the API going away mid-query. FailOn makes a specific
// page return an error instead of its canned data, simulating a real fetch
// failure.
type FakeShipBob struct {
	NewPages     [][]map[string]any
	UpdatedPages [][]map[string]any
	OnPage       func(half pageHalf, page int)
	FailOn       *pageRef
	Pages        map[pageHalf][]int
}

func newFakeShipBob() *FakeShipBob {
	return &FakeShipBob{Pages: map[pageHalf][]int{halfNew: {}, halfUpdated: {}}}
}

func (f *FakeShipBob) page(h pageHalf, pages [][]map[string]any, pageNum int) ([]map[string]any, error) {
	f.Pages[h] = append(f.Pages[h], pageNum)
	if f.OnPage != nil {
		f.OnPage(h, pageNum)
	}
	if f.FailOn != nil && f.FailOn.half == h && f.FailOn.page == pageNum {
		return nil, errors.New("simulated ShipBob fetch failure")
	}
	if pageNum >= 1 && pageNum-1 < len(pages) {
		return pages[pageNum-1], nil
	}
	return nil, nil
}

func (f *FakeShipBob) NewOrdersPage(_ time.Time, page int) ([]map[string]any, error) {
	return f.page(halfNew, f.NewPages, page)
}

func (f *FakeShipBob) UpdatedOrdersPage(_ time.Time, page int) ([]map[string]any, error) {
	return f.page(halfUpdated, f.UpdatedPages, page)
}

func (f *FakeShipBob) UpdateDate(order map[string]any, _ time.Time) time.Time {
	shipments, _ := order["shipments"].([]any)
	if len(shipments) == 0 {
		return time.Time{}
	}
	shipment, _ := shipments[0].(map[string]any)
	ts, _ := shipment["last_update_at"].(string)
	parsed, _ := parseTimestamp(ts)
	return parsed
}
