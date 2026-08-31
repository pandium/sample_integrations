package main

import (
	"fmt"
	"os"
	"sort"
	"strings"
	"sync"
	"time"
)

var cronLogger = newLogger("cron")

// The cron flow: ShipBob orders -> Gorgias customer sidebar.
//
// Keeps each Gorgias customer's data.pandium.shipbob_orders in sync with that
// customer's recent ShipBob orders. Runs on a schedule and resumes where the last
// run left off, using tenant metadata as the cursor.
//
// The run is bounded at ~10 minutes by Pandium. To stay resumable, the loop keeps
// cursor state current as each order is processed, and a watchdog timer flushes
// that state before the hard kill. Exiting 0 on timeout means the partial cursor
// is merged into metadata and the next run picks up from there.
//
// The two cursors resume differently. new_order_start_date climbs per order over
// an oldest-first query, so it is sound wherever the run stops.
// updated_order_start_date is the minimum across every page, so it only holds
// once the query is exhausted — an unread page can carry an older update — and a
// run cut short leaves it where it started. Re-syncing what it covers again is
// harmless: customer writes are idempotent PUTs.
const (
	alarmDuration   = 540 * time.Second // self-imposed 9-min alarm, ahead of Pandium's ~10-min kill
	oneMonth        = 30 * 24 * time.Hour
	maxOrdersToSync = 10 // most recent N orders kept on each customer
)

// Clamp keeps a cursor within [now - 1 month, now]. Unparseable/missing values
// fall back to one month ago (the oldest window we ever fetch).
func Clamp(value string, now time.Time) time.Time {
	floor := now.Add(-oneMonth)
	parsed, ok := parseTimestamp(value)
	if !ok {
		return floor
	}
	if parsed.Before(floor) {
		return floor
	}
	if parsed.After(now) {
		return now
	}
	return parsed
}

func formatCursor(t time.Time) string {
	return t.UTC().Format("2006-01-02T15:04:05.000000")
}

// cursorState is the timeout record: the cursor written on either outcome.
// Shared between the paging loop and the watchdog goroutine, so every access is
// guarded.
type cursorState struct {
	mu                    sync.Mutex
	newOrderStartDate     string
	updatedOrderStartDate string
}

func (c *cursorState) setNew(v string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.newOrderStartDate = v
}

func (c *cursorState) setUpdated(v string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.updatedOrderStartDate = v
}

func (c *cursorState) snapshot() map[string]any {
	c.mu.Lock()
	defer c.mu.Unlock()
	return map[string]any{
		"new_order_start_date":     c.newOrderStartDate,
		"updated_order_start_date": c.updatedOrderStartDate,
	}
}

func orderID(order map[string]any) float64 {
	return toFloat64(order["id"])
}

func toFloat64(v any) float64 {
	switch n := v.(type) {
	case float64:
		return n
	case int:
		return float64(n)
	}
	return 0
}

func trimTo(s string, n int) string {
	if len(s) > n {
		return s[:n]
	}
	return s
}

// upsertOrder merges orderPayload into a customer's order list (replace by id,
// else append), then sorts and trims to the most recent maxOrdersToSync.
func upsertOrder(orders []map[string]any, orderPayload map[string]any, newestFirst bool) []map[string]any {
	newID := orderID(orderPayload)
	for i, existing := range orders {
		if orderID(existing) == newID {
			orders[i] = orderPayload
			return orders // in-place replace; no re-sort/trim needed
		}
	}

	orders = append(orders, orderPayload)
	sort.Slice(orders, func(i, j int) bool {
		if newestFirst {
			return orderID(orders[i]) > orderID(orders[j])
		}
		return orderID(orders[i]) < orderID(orders[j])
	})
	if len(orders) > maxOrdersToSync {
		if newestFirst {
			orders = orders[:maxOrdersToSync]
		} else {
			orders = orders[len(orders)-maxOrdersToSync:]
		}
	}
	return orders
}

// processOrder finds-or-creates the order's Gorgias customer, then PUT/POSTs its
// updated data.pandium.shipbob_orders. cache accumulates customer payloads within
// a run so multiple orders for one customer batch onto the same record.
func processOrder(order map[string]any, gorgias GorgiasClient, cache map[string]map[string]any, newestFirst bool) {
	key := CustomerKey(order)
	email := ValidEmail(asString(deepGet(order, "recipient.email", "")))

	customer, cached := cache[key]
	if !cached {
		var externalID string
		if email == "" {
			externalID = key
		}
		existing, err := gorgias.FindCustomer(email, externalID)
		if err != nil {
			cronLogger.Error(fmt.Sprintf("Skipping order %s — cannot fetch customer %s: %s", formatID(order["id"]), key, err))
			return
		}

		if existing != nil {
			// Anything already under data.pandium came from outside this
			// integration — a hand-edited customer can carry {"pandium": null} —
			// so check the type at every level rather than just the leaf.
			data, ok := existing["data"].(map[string]any)
			if !ok {
				data = map[string]any{}
			}
			pandium, ok := data["pandium"].(map[string]any)
			if !ok {
				pandium = map[string]any{}
			}
			if _, ok := pandium["shipbob_orders"].([]any); !ok {
				pandium["shipbob_orders"] = []any{}
			}
			data["pandium"] = pandium
			customer = map[string]any{"id": existing["id"], "data": data}
		} else {
			customer = NewCustomerPayload(order, key)
		}
		cache[key] = customer
	}

	data, _ := customer["data"].(map[string]any)
	pandium, _ := data["pandium"].(map[string]any)
	ordersAny, _ := pandium["shipbob_orders"].([]any)
	orders := make([]map[string]any, 0, len(ordersAny))
	for _, o := range ordersAny {
		if m, ok := o.(map[string]any); ok {
			orders = append(orders, m)
		}
	}
	orders = upsertOrder(orders, OrderDataPayload(order), newestFirst)
	ordersAny = make([]any, len(orders))
	for i, o := range orders {
		ordersAny[i] = o
	}
	pandium["shipbob_orders"] = ordersAny

	if id, hasID := customer["id"]; hasID {
		if err := gorgias.UpdateCustomer(toFloat64(id), customer); err != nil {
			cronLogger.Error(fmt.Sprintf("Failed to upsert Gorgias customer %s: %s", key, err))
		}
	} else {
		newID, err := gorgias.CreateCustomer(customer)
		if err != nil {
			cronLogger.Error(fmt.Sprintf("Failed to upsert Gorgias customer %s: %s", key, err))
			return
		}
		customer["id"] = newID
	}
}

// watchdogArmer schedules onTimeout to run after deadline, returning a function
// that cancels it. Injectable so tests can trigger the timeout deterministically
// without waiting real minutes.
type watchdogArmer func(deadline time.Duration, onTimeout func()) (cancel func())

func defaultArmWatchdog(deadline time.Duration, onTimeout func()) (cancel func()) {
	timer := time.AfterFunc(deadline, onTimeout)
	return func() { timer.Stop() }
}

type cronDeps struct {
	ShipBob     ShipBobClient
	Gorgias     GorgiasClient
	ArmWatchdog watchdogArmer
	Exit        func(code int) // defaults to os.Exit; tests substitute something that doesn't kill the test process
	Now         time.Time
}

func cronRun(pandium *Pandium) (map[string]any, error) {
	shipbob, err := NewShipBobAPI(pandium)
	if err != nil {
		return nil, err
	}
	gorgias, err := NewGorgiasAPI(pandium)
	if err != nil {
		return nil, err
	}
	return runCron(pandium, cronDeps{
		ShipBob:     shipbob,
		Gorgias:     gorgias,
		ArmWatchdog: defaultArmWatchdog,
		Exit:        os.Exit,
		Now:         time.Now(),
	})
}

// runCron is the tested core: everything it touches arrives through deps.
func runCron(pandium *Pandium, deps cronDeps) (map[string]any, error) {
	now := deps.Now
	metadata := pandium.Metadata()
	if metadata == nil {
		metadata = map[string]any{}
	}
	fallback := pandium.Config["order_start_date"]

	newCursor := Clamp(firstNonEmpty(asString(metadata["new_order_start_date"]), fallback), now)
	updatedCursor := Clamp(firstNonEmpty(asString(metadata["updated_order_start_date"]), fallback), now)

	state := &cursorState{
		newOrderStartDate:     formatCursor(newCursor),
		updatedOrderStartDate: formatCursor(updatedCursor),
	}

	cancel := deps.ArmWatchdog(alarmDuration, func() {
		cronLogger.Error("Approaching the run-time limit — flushing cursor for the next run.")
		// Same writer the normal path uses, so there is exactly one route to stdout.
		pandium.UpdateMetadata(state.snapshot())
		deps.Exit(0) // timed-out run still counts as successful -> partial cursor merged
	})

	cache := make(map[string]map[string]any)
	newestFirst := strings.ToLower(pandium.Config["newest_order_first"]) == "true"

	// New orders: SortOrder=Oldest, so created_date advances forward monotonically.
	cronLogger.Info(fmt.Sprintf("Syncing new ShipBob orders since %s", state.newOrderStartDate))
	page := 1
	for {
		orders, err := deps.ShipBob.NewOrdersPage(newCursor, page)
		if err != nil {
			cancel()
			return nil, err
		}
		if len(orders) == 0 {
			break
		}
		for _, order := range orders {
			cronLogger.Info(fmt.Sprintf("Processing new order with id %s", formatID(order["id"])))
			processOrder(order, deps.Gorgias, cache, newestFirst)
			// created_date is YYYY-MM-DDThh:mm:ss.sssssss+00:00; trim to 26 chars
			// for a valid (naive, microsecond) date-time.
			if created, ok := order["created_date"].(string); ok && created != "" {
				state.setNew(trimTo(created, 26))
			}
		}
		page++
	}

	// Updated orders: keyed off shipment last_update_at (see UpdatedOrdersPage).
	cronLogger.Info(fmt.Sprintf("Syncing updated ShipBob orders since %s", state.updatedOrderStartDate))
	page = 1
	// Each page is sorted newest-first, but pages are not sorted relative to each
	// other, so the cursor is the minimum across every processed order — not
	// whatever the last order of the last page happened to carry. Kept in a local
	// variable, not cursorState, until the loop ends: every update date is, by
	// construction, later than the starting cursor, so folding that in would pin
	// the cursor there forever, and a partial minimum would sit newer than the
	// pages still unread.
	var oldestUpdate *time.Time
	for {
		orders, err := deps.ShipBob.UpdatedOrdersPage(updatedCursor, page)
		if err != nil {
			cancel()
			return nil, err
		}
		if len(orders) == 0 {
			break
		}
		for _, order := range orders {
			cronLogger.Info(fmt.Sprintf("Processing updated order with id %s", formatID(order["id"])))
			processOrder(order, deps.Gorgias, cache, newestFirst)
			updateDate := deps.ShipBob.UpdateDate(order, updatedCursor)
			if oldestUpdate == nil || updateDate.Before(*oldestUpdate) {
				oldestUpdate = &updateDate
			}
		}
		page++
	}

	// Every page is in, so the minimum is final and safe to resume from.
	if oldestUpdate != nil {
		state.setUpdated(formatCursor(*oldestUpdate))
	}

	cancel() // made it — no timeout to flush
	return state.snapshot(), nil
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if v != "" {
			return v
		}
	}
	return ""
}
