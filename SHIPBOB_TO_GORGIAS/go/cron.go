package main

import (
	"context"
	"sort"
	"strings"
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
// cursor state current as each order is processed, and a self-imposed deadline
// (ctx, below) stops the loop before the hard kill. Stopping there and returning
// the cursor normally is still success: the partial cursor is merged into
// metadata and the next run picks up from there.
//
// The two cursors resume differently. new_order_start_date climbs per order over
// an oldest-first query, so it is sound wherever the run stops.
// updated_order_start_date is the minimum across every page, so it only holds
// once the query is exhausted — an unread page can carry an older update — and a
// run cut short leaves it where it started. Re-syncing what it covers again is
// harmless: customer writes are idempotent PUTs.
const (
	alarmDuration   = 540 * time.Second // self-imposed 9-min deadline, ahead of Pandium's ~10-min kill
	oneMonth        = 30 * 24 * time.Hour
	maxOrdersToSync = 10 // most recent N orders kept on each customer
)

// clamp keeps a cursor within [now - 1 month, now]. Unparseable/missing values
// fall back to one month ago (the oldest window we ever fetch).
func clamp(value string, now time.Time) time.Time {
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

// cursorState is the record written back as this run's cursor.
type cursorState struct {
	newOrderStartDate     string
	updatedOrderStartDate string
}

func (c *cursorState) snapshot() map[string]any {
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
func processOrder(ctx context.Context, order map[string]any, gorgias GorgiasClient, cache map[string]map[string]any, newestFirst bool) {
	r := recipientFromOrder(order)
	key := customerKey(r)
	email := validEmail(r.Email)

	customer, cached := cache[key]
	if !cached {
		var externalID string
		if email == "" {
			externalID = key
		}
		existing, err := gorgias.FindCustomer(ctx, email, externalID)
		if err != nil {
			cronLogger.Error("cannot fetch customer; skipping order", "order_id", formatID(order["id"]), "customer_key", key, "error", err)
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
			customer = newCustomerPayload(r, key)
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
	orders = upsertOrder(orders, orderDataPayload(order), newestFirst)
	ordersAny = make([]any, len(orders))
	for i, o := range orders {
		ordersAny[i] = o
	}
	pandium["shipbob_orders"] = ordersAny

	if id, hasID := customer["id"]; hasID {
		if err := gorgias.UpdateCustomer(ctx, toFloat64(id), customer); err != nil {
			cronLogger.Error("failed to upsert Gorgias customer", "customer_key", key, "error", err)
		}
	} else {
		newID, err := gorgias.CreateCustomer(ctx, customer)
		if err != nil {
			cronLogger.Error("failed to upsert Gorgias customer", "customer_key", key, "error", err)
			return
		}
		customer["id"] = newID
	}
}

type cronDeps struct {
	ShipBob ShipBobClient
	Gorgias GorgiasClient
	Now     time.Time
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
	ctx, cancel := context.WithTimeout(context.Background(), alarmDuration)
	defer cancel()
	return runCron(ctx, pandium, cronDeps{
		ShipBob: shipbob,
		Gorgias: gorgias,
		Now:     time.Now(),
	})
}

// runCron is the tested core: everything it touches arrives through ctx/deps. A
// run that stops itself early because ctx's deadline passed is still a success —
// it returns the cursor normally, the same as a run that finished on its own.
func runCron(ctx context.Context, pandium *Pandium, deps cronDeps) (map[string]any, error) {
	now := deps.Now
	metadata := pandium.Metadata()
	if metadata == nil {
		metadata = map[string]any{}
	}
	fallback := pandium.Config["order_start_date"]

	newCursor := clamp(firstNonEmpty(asString(metadata["new_order_start_date"]), fallback), now)
	updatedCursor := clamp(firstNonEmpty(asString(metadata["updated_order_start_date"]), fallback), now)

	state := &cursorState{
		newOrderStartDate:     formatCursor(newCursor),
		updatedOrderStartDate: formatCursor(updatedCursor),
	}

	cache := make(map[string]map[string]any)
	newestFirst := strings.ToLower(pandium.Config["newest_order_first"]) == "true"

	// New orders: SortOrder=Oldest, so created_date advances forward monotonically.
	// The cursor is written per order (below), so stopping anywhere in this loop
	// leaves it at a sound value — no separate "did we finish" bookkeeping needed.
	cronLogger.Info("syncing new ShipBob orders", "start_date", state.newOrderStartDate)
	page := 1
newOrdersLoop:
	for {
		if ctx.Err() != nil {
			break
		}
		orders, err := deps.ShipBob.NewOrdersPage(ctx, newCursor, page)
		if err != nil {
			if ctx.Err() != nil {
				break // the deadline firing mid-request looks like a fetch error; treat it as a clean stop
			}
			return nil, err
		}
		if len(orders) == 0 {
			break
		}
		for _, order := range orders {
			if ctx.Err() != nil {
				break newOrdersLoop
			}
			cronLogger.Info("processing new order", "order_id", formatID(order["id"]))
			processOrder(ctx, order, deps.Gorgias, cache, newestFirst)
			// created_date is YYYY-MM-DDThh:mm:ss.sssssss+00:00; trim to 26 chars
			// for a valid (naive, microsecond) date-time.
			if created, ok := order["created_date"].(string); ok && created != "" {
				state.newOrderStartDate = trimTo(created, 26)
			}
		}
		page++
	}

	// Updated orders: keyed off shipment last_update_at (see UpdateDate).
	cronLogger.Info("syncing updated ShipBob orders", "start_date", state.updatedOrderStartDate)
	page = 1
	// Each page is sorted newest-first, but pages are not sorted relative to each
	// other, so the cursor is the minimum across every processed order — not
	// whatever the last order of the last page happened to carry. Kept in a local
	// variable, not cursorState, until the loop ends: every update date is, by
	// construction, later than the starting cursor, so folding that in would pin
	// the cursor there forever, and a partial minimum would sit newer than the
	// pages still unread. exhausted tracks whether that end was actually reached —
	// stopping early (the deadline passing mid-loop) must leave the cursor where it started.
	var oldestUpdate *time.Time
	exhausted := false
updatedOrdersLoop:
	for {
		if ctx.Err() != nil {
			break
		}
		orders, err := deps.ShipBob.UpdatedOrdersPage(ctx, updatedCursor, page)
		if err != nil {
			if ctx.Err() != nil {
				break
			}
			return nil, err
		}
		if len(orders) == 0 {
			exhausted = true
			break
		}
		for _, order := range orders {
			if ctx.Err() != nil {
				break updatedOrdersLoop
			}
			cronLogger.Info("processing updated order", "order_id", formatID(order["id"]))
			processOrder(ctx, order, deps.Gorgias, cache, newestFirst)
			updateDate := deps.ShipBob.UpdateDate(order, updatedCursor)
			if oldestUpdate == nil || updateDate.Before(*oldestUpdate) {
				oldestUpdate = &updateDate
			}
		}
		page++
	}

	// Every page is in, so the minimum is final and safe to resume from.
	if exhausted && oldestUpdate != nil {
		state.updatedOrderStartDate = formatCursor(*oldestUpdate)
	}

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
