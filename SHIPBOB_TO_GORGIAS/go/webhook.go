package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

var webhookLogger = newLogger("webhook")

// The webhook flow: any ShipBob order webhook -> a Gorgias ticket.
//
// ShipBob's order-related topics (order_shipped, shipment_delivered,
// shipment_exception, shipment_onhold, shipment_cancelled) all deliver the same
// shipment object, differing only in status/status_details. This flow opens a
// ticket for every one of them, so support sees a shipment the moment it needs
// attention rather than only once it lands.
//
// Each webhook run may carry N debounced deliveries (Pandium bundles triggers
// that arrive while a run is in flight), so we loop over every trigger. Creating
// a ticket is not idempotent and ShipBob retries any delivery that doesn't get a
// 2xx, so we dedupe on shipment_id:status using a processed_events map in tenant
// metadata, pruned to a 30-minute window. Keying on the status as well as the
// shipment means a redelivery is suppressed while a genuine next status for the
// same shipment still opens a ticket.
//
// Because tenant metadata is shallow-merged at the top level, writing the whole
// processed_events object replaces the previous one (dropped keys are really
// removed) while leaving the cron flow's cursor keys untouched.
//
// Pandium verifies each delivery's signature before it ever reaches a run, so the
// bodies handed to this file are already known to have come from ShipBob.
const (
	pruneWindow = 30 * time.Minute
	shipmentTag = "shipbob-shipment"
)

// shipmentEvent is a ShipBob shipment webhook body. ID/ShipmentID are any, not
// string, since either could arrive as a number; formatID renders either safely.
type shipmentEvent struct {
	ID            any            `json:"id"`
	ShipmentID    any            `json:"shipment_id"`
	OrderID       any            `json:"order_id"`
	ReferenceID   string         `json:"reference_id"`
	Status        string         `json:"status"`
	StatusDetails []statusDetail `json:"status_details"`
	Tracking      tracking       `json:"tracking"`
	DeliveryDate  string         `json:"delivery_date"`
	Products      []product      `json:"products"`
	Recipient     recipient      `json:"recipient"`
}

type statusDetail struct {
	Description string `json:"description"`
	Name        string `json:"name"`
}

type tracking struct {
	Carrier        string `json:"carrier"`
	TrackingNumber string `json:"tracking_number"`
}

type product struct {
	Name           string          `json:"name"`
	SKU            string          `json:"sku"`
	ReferenceID    string          `json:"reference_id"`
	InventoryItems []inventoryItem `json:"inventory_items"`
}

type inventoryItem struct {
	Quantity float64 `json:"quantity"`
}

// prune drops entries whose timestamp is more than pruneWindow old (or
// unparseable).
func prune(processed map[string]string, now time.Time) map[string]string {
	kept := make(map[string]string)
	for eventKey, ts := range processed {
		when, ok := parseTimestamp(ts)
		if !ok {
			continue // unparseable -> treat as expired
		}
		if now.Sub(when) <= pruneWindow {
			kept[eventKey] = ts
		}
	}
	return kept
}

// shipmentID reads the shipment id off a webhook event. ShipBob names it "id" on
// the webhook body; older docs and some topics call it "shipment_id". Accept
// either.
func shipmentID(event shipmentEvent) string {
	if id := formatID(event.ID); id != "" {
		return id
	}
	return formatID(event.ShipmentID)
}

// statusDetails is the human-readable reasons ShipBob attached to this status,
// e.g. "Invalid Address; Payment Failure". Empty for statuses that carry none.
func statusDetails(event shipmentEvent) string {
	var reasons []string
	for _, d := range event.StatusDetails {
		if d.Description != "" {
			reasons = append(reasons, d.Description)
		} else {
			reasons = append(reasons, d.Name)
		}
	}
	return strings.Join(reasons, "; ")
}

// items is one line per product on the shipment: "4 x 16 oz. Shampoo (PIN-100)".
func items(event shipmentEvent) string {
	var lines []string
	for _, p := range event.Products {
		var quantity float64
		for _, ii := range p.InventoryItems {
			quantity += ii.Quantity
		}
		sku := p.SKU
		if sku == "" {
			sku = p.ReferenceID
		}
		line := fmt.Sprintf("%v x %s", quantity, p.Name)
		if sku != "" {
			line += fmt.Sprintf(" (%s)", sku)
		}
		lines = append(lines, line)
	}
	return strings.Join(lines, "\n")
}

// buildTicket builds the POST /tickets payload for a shipment webhook of any status.
//
// customerRef is the {id: ...} returned by resolveCustomer. Gorgias wants the
// customer twice — once as the ticket's owner and once as the sender of its
// first message — so the same reference goes in both slots.
func buildTicket(event shipmentEvent, customerRef map[string]any) map[string]any {
	sid := shipmentID(event)
	referenceID := event.ReferenceID
	if referenceID == "" {
		referenceID = formatID(event.OrderID)
	}
	status := event.Status
	if status == "" {
		status = "Updated"
	}
	reasons := statusDetails(event)
	carrier := event.Tracking.Carrier
	trackingNumber := event.Tracking.TrackingNumber
	deliveredOn := trimTo(event.DeliveryDate, 10)

	headline := fmt.Sprintf("Shipment %s for order %s is now %s.", sid, referenceID, status)

	// Only the parts ShipBob actually sent for this status make it into the body —
	// an OnHold shipment has no tracking, a Delivered one has no status details.
	lines := []string{headline}
	if reasons != "" {
		lines = append(lines, "Reason: "+reasons)
	}
	if carrier != "" || trackingNumber != "" {
		lines = append(lines, strings.TrimSpace(fmt.Sprintf("Tracking: %s %s", carrier, trackingNumber)))
	}
	if deliveredOn != "" {
		lines = append(lines, "Delivered on: "+deliveredOn)
	}
	itemLines := items(event)
	if itemLines != "" {
		lines = append(lines, "Items:\n"+itemLines)
	}
	bodyText := strings.Join(lines, "\n")

	html := []string{fmt.Sprintf("<p>%s</p>", headline)}
	if reasons != "" {
		html = append(html, fmt.Sprintf("<p><b>Reason:</b> %s</p>", reasons))
	}
	if carrier != "" || trackingNumber != "" {
		html = append(html, fmt.Sprintf("<p><b>Tracking:</b> %s %s</p>", carrier, trackingNumber))
	}
	if itemLines != "" {
		var li strings.Builder
		li.WriteString("<ul>")
		for _, line := range strings.Split(itemLines, "\n") {
			li.WriteString(fmt.Sprintf("<li>%s</li>", line))
		}
		li.WriteString("</ul>")
		html = append(html, li.String())
	}

	message := map[string]any{
		"sender":     customerRef,
		"channel":    "api",
		"via":        "api",
		"from_agent": false,
		"subject":    fmt.Sprintf("Order %s: shipment %s", referenceID, status),
		"body_text":  bodyText,
		"body_html":  strings.Join(html, ""),
		// Included so Gorgias auto-reply / keyword rules can fire.
		"stripped_text": headline,
	}
	return map[string]any{
		"customer":   customerRef,
		"channel":    "api",
		"via":        "api",
		"from_agent": false,
		"status":     "open",
		"messages":   []any{message},
		// A constant tag to find every ticket this flow opened, plus the status so
		// Gorgias rules can route (e.g. OnHold) without parsing the body.
		"tags": []any{
			map[string]any{"name": shipmentTag},
			map[string]any{"name": "shipbob-" + strings.ReplaceAll(strings.ToLower(status), " ", "-")},
		},
	}
}

// resolveCustomer finds-or-creates the Gorgias customer for a shipment's
// recipient and returns the reference to attach the ticket to.
//
// Uses the same key the cron flow does — a valid recipient email when there is
// one, otherwise the synthetic name address1 city country external_id — so a
// webhook ticket lands on the same record that carries the customer's order
// history. Recipient email is optional on a ShipBob shipment, so the external_id
// path carries as much weight here as it does in the cron flow.
func resolveCustomer(ctx context.Context, gorgias GorgiasClient, event shipmentEvent) (map[string]any, error) {
	email := validEmail(event.Recipient.Email)
	key := customerKey(event.Recipient)

	var externalID string
	if email == "" {
		externalID = key
	}
	existing, err := gorgias.FindCustomer(ctx, email, externalID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return map[string]any{"id": existing["id"]}, nil
	}
	newID, err := gorgias.CreateCustomer(ctx, newCustomerPayload(event.Recipient, key))
	if err != nil {
		return nil, err
	}
	return map[string]any{"id": newID}, nil
}

func webhookRun(pandium *Pandium) (map[string]any, error) {
	gorgias, err := NewGorgiasAPI(pandium)
	if err != nil {
		return nil, err
	}
	return runWebhook(context.Background(), pandium, gorgias, time.Now())
}

func runWebhook(ctx context.Context, pandium *Pandium, gorgias GorgiasClient, now time.Time) (map[string]any, error) {
	metadata := pandium.Metadata()
	if metadata == nil {
		metadata = map[string]any{}
	}
	processedRaw, _ := metadata["processed_events"].(map[string]any)
	processed := make(map[string]string, len(processedRaw))
	for k, v := range processedRaw {
		processed[k] = asString(v)
	}
	processed = prune(processed, now)

	nowISO := now.UTC().Format(time.RFC3339)
	created := 0

	// Pandium bundles debounced deliveries into one run; Pandium.WebhookDeliveries reads
	// each raw body back off disk so this loop only has to deal with the event itself.
	for _, delivery := range pandium.WebhookDeliveries() {
		var event shipmentEvent
		if err := json.Unmarshal([]byte(delivery.Body), &event); err != nil {
			webhookLogger.Error("webhook delivery is not valid JSON", "delivery_id", delivery.ID, "error", err)
			continue
		}

		sid := shipmentID(event)
		if sid == "" {
			webhookLogger.Error("webhook delivery has no shipment id; skipping", "delivery_id", delivery.ID)
			continue
		}

		// Every order webhook gets a ticket, whatever the status — the status is
		// only part of the dedupe key, never a filter.
		status := event.Status
		if status == "" {
			status = "Updated"
		}
		eventKey := fmt.Sprintf("%s:%s", sid, status)
		if _, seen := processed[eventKey]; seen {
			webhookLogger.Info("shipment already ticketed; skipping duplicate", "shipment_id", sid, "status", status)
			continue
		}

		customerRef, err := resolveCustomer(ctx, gorgias, event)
		if err != nil {
			webhookLogger.Error("could not resolve a Gorgias customer for shipment", "shipment_id", sid, "error", err)
			continue // leave unprocessed so ShipBob's retry can try again
		}

		ticket, err := gorgias.CreateTicket(ctx, buildTicket(event, customerRef))
		if err != nil {
			webhookLogger.Error("failed to open ticket for shipment", "shipment_id", sid, "error", err)
			continue // leave unprocessed so ShipBob's retry can try again
		}

		processed[eventKey] = nowISO // mark handled
		created++
		webhookLogger.Info("opened Gorgias ticket for shipment", "ticket_id", formatID(ticket["id"]), "shipment_id", sid, "status", status)
	}

	webhookLogger.Info("webhook flow complete", "tickets_opened", created, "events_tracked", len(processed))
	// Replaces the map (30-min pruned); shallow merge leaves the cron flow's cursor keys intact.
	processedAny := make(map[string]any, len(processed))
	for k, v := range processed {
		processedAny[k] = v
	}
	return map[string]any{"processed_events": processedAny}, nil
}
