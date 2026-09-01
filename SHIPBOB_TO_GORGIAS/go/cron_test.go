package main

import (
	"bytes"
	"encoding/json"
	"io"
	"os"
	"reflect"
	"sort"
	"strings"
	"testing"
	"time"
)

// ago is a ShipBob-shaped timestamp `days` back — seven fractional digits, as the
// real API sends — inside Clamp's 30-day window.
func ago(days int) string {
	d := time.Now().Add(-time.Duration(days) * 24 * time.Hour).UTC()
	return d.Format("2006-01-02T15:04:05") + ".1234567+00:00"
}

func captureStdout(t *testing.T, fn func()) string {
	t.Helper()
	old := os.Stdout
	r, w, err := os.Pipe()
	if err != nil {
		t.Fatal(err)
	}
	os.Stdout = w
	fn()
	w.Close()
	os.Stdout = old
	var buf bytes.Buffer
	io.Copy(&buf, r)
	return buf.String()
}

func TestClamp_BoundsCursorBetweenOneMonthAgoAndNow(t *testing.T) {
	now := time.Date(2026, 7, 16, 12, 0, 0, 0, time.UTC)
	if got := Clamp("2026-07-10T00:00:00Z", now); !got.Equal(time.Date(2026, 7, 10, 0, 0, 0, 0, time.UTC)) {
		t.Errorf("in range: got %v", got)
	}
	if got := Clamp("2099-01-01T00:00:00Z", now); !got.Equal(now) {
		t.Errorf("future -> now: got %v, want %v", got, now)
	}
	floor := now.Add(-oneMonth)
	if got := Clamp("", now); !got.Equal(floor) {
		t.Errorf("missing -> floor: got %v, want %v", got, floor)
	}
}

func TestRun_PagesUntilEmpty_UpsertsCustomer_AdvancesCursor(t *testing.T) {
	shipbob := newFakeShipBob()
	shipbob.NewPages = [][]map[string]any{
		{makeOrder(1, ago(6), "jane@example.com"), makeOrder(2, ago(5), "jane@example.com")},
	}
	gorgias := newRecordingGorgias()
	pandium := newTestPandium(t, testPandiumOpts{secrets: gorgiasSecrets, config: map[string]string{"order_start_date": ago(20)}})

	record, err := runCron(pandium, cronDeps{
		ShipBob: shipbob, Gorgias: gorgias, ArmWatchdog: defaultArmWatchdog, Exit: os.Exit, Now: time.Now(),
	})
	if err != nil {
		t.Fatal(err)
	}

	if got := shipbob.Pages[halfNew]; !reflect.DeepEqual(got, []int{1, 2}) { // paged until the empty page
		t.Errorf("pages = %v, want [1 2]", got)
	}
	if len(gorgias.Log.create) != 1 { // both orders batch onto one customer
		t.Errorf("create count = %d, want 1", len(gorgias.Log.create))
	}
	want := trimTo(ago(5), 26) // advanced to the last order
	if got := record["new_order_start_date"]; got != want {
		t.Errorf("new_order_start_date = %v, want %v", got, want)
	}

	last := gorgias.Log.update[len(gorgias.Log.update)-1]
	data, _ := last.payload["data"].(map[string]any)
	pandiumData, _ := data["pandium"].(map[string]any)
	ordersAny, _ := pandiumData["shipbob_orders"].([]any)
	var ids []float64
	for _, o := range ordersAny {
		m, _ := o.(map[string]any)
		ids = append(ids, toFloat64(m["id"]))
	}
	sort.Float64s(ids)
	if !reflect.DeepEqual(ids, []float64{1, 2}) {
		t.Errorf("final order ids = %v, want [1 2]", ids)
	}
}

func TestRun_AdvancesUpdatedCursorToOldestAcrossPages(t *testing.T) {
	// Pages are each sorted newest-first, but not relative to each other, so the
	// cursor has to be the oldest update seen anywhere — not the last one
	// processed.
	shipbob := newFakeShipBob()
	shipbob.UpdatedPages = [][]map[string]any{
		{makeOrder(1, ago(2), "j@x.com"), makeOrder(2, ago(3), "j@x.com")},
		{makeOrder(3, ago(9), "j@x.com"), makeOrder(4, ago(8), "j@x.com")}, // oldest update overall
		{makeOrder(5, ago(4), "j@x.com")},                                  // newer again, after the oldest page
	}
	gorgias := newRecordingGorgias()
	pandium := newTestPandium(t, testPandiumOpts{secrets: gorgiasSecrets, config: map[string]string{"order_start_date": ago(20)}})

	record, err := runCron(pandium, cronDeps{
		ShipBob: shipbob, Gorgias: gorgias, ArmWatchdog: defaultArmWatchdog, Exit: os.Exit, Now: time.Now(),
	})
	if err != nil {
		t.Fatal(err)
	}

	got, ok := parseTimestamp(asString(record["updated_order_start_date"]))
	want, _ := parseTimestamp(ago(9)) // not order 5, the last processed
	if !ok || !got.Equal(want) {
		t.Errorf("updated_order_start_date = %v, want %v (parsed from %s)", got, want, ago(9))
	}
}

type exitSignal struct{ code int }

func TestTimeout_FlushesTheFinishedHalfAndLeavesTheInterruptedOne(t *testing.T) {
	// The two cursors resume differently. new_order_start_date climbs per order
	// over an oldest-first query, so it is sound wherever the run stops.
	// updated_order_start_date is the minimum across every page, so it only holds
	// once the query is exhausted — an unread page can carry an older update —
	// and a run cut short flushes the value it started with.
	var capturedOnTimeout func()
	armWatchdog := func(_ time.Duration, onTimeout func()) func() {
		capturedOnTimeout = onTimeout
		return func() {}
	}

	now := time.Now()
	start := ago(20)
	shipbob := newFakeShipBob()
	shipbob.NewPages = [][]map[string]any{{makeOrder(1, ago(6), "j@x.com")}}
	shipbob.UpdatedPages = [][]map[string]any{
		{makeOrder(2, ago(2), "j@x.com")},
		{makeOrder(3, ago(9), "j@x.com")}, // never read
	}
	shipbob.OnPage = func(h pageHalf, page int) {
		if h == halfUpdated && page == 2 && capturedOnTimeout != nil {
			capturedOnTimeout()
		}
	}
	gorgias := newRecordingGorgias()
	pandium := newTestPandium(t, testPandiumOpts{secrets: gorgiasSecrets, config: map[string]string{"order_start_date": start}})

	var caught any
	output := captureStdout(t, func() {
		defer func() { caught = recover() }()
		_, _ = runCron(pandium, cronDeps{
			ShipBob:     shipbob,
			Gorgias:     gorgias,
			ArmWatchdog: armWatchdog,
			Exit:        func(code int) { panic(exitSignal{code}) },
			Now:         now,
		})
	})

	sig, ok := caught.(exitSignal)
	if !ok {
		t.Fatalf("expected an exitSignal panic, got %#v", caught)
	}
	if sig.code != 0 { // a timed-out run still succeeds, so progress merges
		t.Errorf("exit code = %d, want 0", sig.code)
	}

	lines := strings.Split(strings.TrimSpace(output), "\n")
	var flushed map[string]any
	if err := json.Unmarshal([]byte(lines[len(lines)-1]), &flushed); err != nil {
		t.Fatalf("could not parse flushed metadata %q: %s", output, err)
	}

	wantNew := trimTo(ago(6), 26) // that half finished
	if got := flushed["new_order_start_date"]; got != wantNew {
		t.Errorf("new_order_start_date = %v, want %v", got, wantNew)
	}
	wantUpdated := formatCursor(Clamp(start, now)) // this one did not
	if got := flushed["updated_order_start_date"]; got != wantUpdated {
		t.Errorf("updated_order_start_date = %v, want %v", got, wantUpdated)
	}
}

// TestRun_FetchFailureEndsRunRatherThanCommittingCursor is the loop-level
// counterpart to TestGetOrders_RaisesInsteadOfReportingItselfEmpty: proves the
// error actually propagates out of the paging loop instead of being treated as
// an exhausted query.
func TestRun_FetchFailureEndsRunRatherThanCommittingCursor(t *testing.T) {
	shipbob := newFakeShipBob()
	shipbob.NewPages = [][]map[string]any{
		{makeOrder(1, ago(6), "j@x.com")},
		{makeOrder(2, ago(5), "j@x.com")},
	}
	shipbob.FailOn = &pageRef{half: halfNew, page: 2}
	gorgias := newRecordingGorgias()
	pandium := newTestPandium(t, testPandiumOpts{secrets: gorgiasSecrets, config: map[string]string{"order_start_date": ago(20)}})

	_, err := runCron(pandium, cronDeps{
		ShipBob: shipbob, Gorgias: gorgias, ArmWatchdog: defaultArmWatchdog, Exit: os.Exit, Now: time.Now(),
	})
	if err == nil {
		t.Fatal("expected an error from the failed fetch, got nil")
	}
	if got := shipbob.Pages[halfNew]; !reflect.DeepEqual(got, []int{1, 2}) {
		t.Errorf("pages requested = %v, want [1 2] (stopped at the failure)", got)
	}
}
