//! The webhook flow: any ShipBob order webhook → a Gorgias ticket.
//!
//! Each webhook run may carry N debounced deliveries — Pandium bundles triggers
//! that arrive while a run is in flight — so the flow loops over every one.
//! Creating a ticket is not idempotent and ShipBob retries any delivery that
//! does not get a 2xx, so deliveries are deduped on `shipment_id:status` using a
//! `processed_events` map in tenant metadata, pruned to a 30-minute window.
//! Keying on the status as well as the shipment is what lets a redelivery be
//! dropped while the shipment's genuine *next* status still opens its own
//! ticket.
//!
//! Because tenant metadata is shallow-merged at the top level, writing the whole
//! `processed_events` object *replaces* the previous one — dropped keys really
//! are removed — while leaving the cron flow's cursor keys alone.
//!
//! Pandium verifies each delivery's signature before it ever reaches a run, so
//! the bodies handed to this module are already known to have come from ShipBob.

use anyhow::{Context, Result};
use chrono::{DateTime, NaiveDateTime, TimeDelta, Utc};
use serde_json::{Map, Value, json};

use crate::dates;
use crate::gorgias::{CustomerKey, Gorgias, Helpdesk};
use crate::pandium::{Pandium, WebhookDelivery};
use crate::shipbob::Shipment;

/// How long a handled event is remembered. Long enough to cover ShipBob's retry
/// schedule and Pandium's debouncing, short enough that the map stays small.
const PRUNE_WINDOW_MINUTES: i64 = 30;

/// Goes on every ticket this flow opens, so they can all be found at once.
const SHIPMENT_TAG: &str = "shipbob-shipment";

pub fn run(pandium: &Pandium) -> Result<Value> {
    let now = Utc::now();
    let mut processed = prune(&pandium.metadata()["processed_events"], now.naive_utc());
    let gorgias = Gorgias::new(pandium)?;

    process(&pandium.webhook_deliveries(), &gorgias, &mut processed, now);

    Ok(json!({ "processed_events": processed }))
}

/// Open a ticket for every delivery that has not been ticketed already, marking
/// each one handled in `processed` as it goes.
///
/// Split out from [`run`] so it can be driven by test doubles.
pub fn process(
    deliveries: &[WebhookDelivery],
    gorgias: &dyn Helpdesk,
    processed: &mut Map<String, Value>,
    now: DateTime<Utc>,
) {
    let now = json!(now.to_rfc3339());
    let mut opened = 0;

    for delivery in deliveries {
        let event: Shipment = match serde_json::from_str(&delivery.body) {
            Ok(event) => event,
            Err(err) => {
                log::error!("webhook delivery {} is not a shipment: {err}", delivery.id);
                continue;
            }
        };

        let Some(shipment_id) = event.id else {
            log::warn!("webhook delivery {} has no shipment id", delivery.id);
            continue;
        };

        // Every order webhook gets a ticket, whatever the status — the status is
        // only ever part of the dedupe key, never a filter.
        let status = event.reported_status();
        let event_key = format!("{shipment_id}:{status}");
        if processed.contains_key(&event_key) {
            log::info!("shipment {shipment_id} is already ticketed as {status}; skipping");
            continue;
        }

        let customer = match resolve_customer(gorgias, &event) {
            Ok(customer) => customer,
            Err(err) => {
                // Left unprocessed on purpose, so ShipBob's retry gets another go.
                log::error!("no Gorgias customer for shipment {shipment_id}: {err:#}");
                continue;
            }
        };

        match gorgias.create_ticket(&build_ticket(&event, customer)) {
            Ok(ticket) => {
                log::info!(
                    "opened Gorgias ticket {} for shipment {shipment_id} ({status})",
                    ticket["id"]
                );
                processed.insert(event_key, now.clone());
                opened += 1;
            }
            Err(err) => log::error!("failed to open a ticket for {shipment_id}: {err:#}"),
        }
    }

    log::info!(
        "webhook flow: opened {opened} ticket(s); tracking {} event(s)",
        processed.len()
    );
}

/// Drop entries older than [`PRUNE_WINDOW_MINUTES`], or too mangled to date.
fn prune(processed: &Value, now: NaiveDateTime) -> Map<String, Value> {
    let window = TimeDelta::minutes(PRUNE_WINDOW_MINUTES);
    let Some(entries) = processed.as_object() else {
        return Map::new(); // no metadata yet, so nothing has been ticketed
    };
    entries
        .iter()
        .filter(|(_, ticketed_at)| {
            ticketed_at
                .as_str()
                .and_then(dates::parse)
                .is_some_and(|ticketed_at| now - ticketed_at <= window)
        })
        .map(|(key, value)| (key.clone(), value.clone()))
        .collect()
}

/// Find-or-create the Gorgias customer for a shipment's recipient, and return
/// the id to hang the ticket off.
///
/// Uses the same key the cron flow does, so a webhook ticket lands on the record
/// that already carries the customer's order history.
fn resolve_customer(gorgias: &dyn Helpdesk, event: &Shipment) -> Result<i64> {
    let key = CustomerKey::for_recipient(&event.recipient);
    match gorgias.find_customer(&key)? {
        Some(customer) => customer["id"].as_i64().context("customer has no id"),
        None => gorgias.create_customer(&crate::gorgias::new_customer_payload(
            &event.recipient,
            &key,
        )),
    }
}

/// The `POST /tickets` payload for a shipment webhook of any status.
///
/// Only the parts ShipBob actually sent for this status make it into the body —
/// an OnHold shipment has no tracking, a Delivered one has no status details —
/// which is why `Shipment` models those fields as [`Option`] and this walks
/// through them one at a time instead of filling in a fixed template.
pub fn build_ticket(event: &Shipment, customer_id: i64) -> Value {
    let shipment_id = event.id.unwrap_or_default();
    let reference = event.order_reference();
    let status = event.reported_status();
    let headline = format!("Shipment {shipment_id} for order {reference} is now {status}.");

    let mut text = vec![headline.clone()];
    let mut html = vec![format!("<p>{headline}</p>")];

    let reasons = status_reasons(event);
    if !reasons.is_empty() {
        text.push(format!("Reason: {reasons}"));
        html.push(format!("<p><b>Reason:</b> {reasons}</p>"));
    }
    if let Some(tracking) = &event.tracking {
        let carrier = tracking.carrier.as_deref().unwrap_or_default();
        let number = tracking.tracking_number.as_deref().unwrap_or_default();
        let tracking = format!("{carrier} {number}");
        if !tracking.trim().is_empty() {
            text.push(format!("Tracking: {}", tracking.trim()));
            html.push(format!("<p><b>Tracking:</b> {tracking}</p>"));
        }
    }
    if let Some(delivered_on) = event.delivered_on() {
        text.push(format!("Delivered on: {delivered_on}"));
    }
    let items = items(event);
    if !items.is_empty() {
        text.push(format!("Items:\n{items}"));
        let list: String = items
            .lines()
            .map(|item| format!("<li>{item}</li>"))
            .collect();
        html.push(format!("<ul>{list}</ul>"));
    }

    // Gorgias wants the customer twice — once as the ticket's owner and once as
    // the sender of its first message — so the same reference goes in both slots.
    let customer = json!({ "id": customer_id });
    json!({
        "customer": customer,
        "channel": "api",
        "via": "api",
        "from_agent": false,
        "status": "open",
        "messages": [{
            "sender": customer,
            "channel": "api",
            "via": "api",
            "from_agent": false,
            "subject": format!("Order {reference}: shipment {status}"),
            "body_text": text.join("\n"),
            "body_html": html.concat(),
            // Included so Gorgias auto-reply and keyword rules can fire.
            "stripped_text": headline,
        }],
        // A constant tag to find every ticket this flow opened, plus the status,
        // so Gorgias rules can route on it without parsing the body.
        "tags": [
            {"name": SHIPMENT_TAG},
            {"name": format!("shipbob-{}", status.to_lowercase().replace(' ', "-"))},
        ],
    })
}

/// The human-readable reasons ShipBob attached to this status, e.g.
/// `Invalid Address; Payment Failure`. Empty for statuses that carry none.
fn status_reasons(event: &Shipment) -> String {
    event
        .status_details
        .iter()
        .filter_map(|detail| detail.description.as_deref().or(detail.name.as_deref()))
        .collect::<Vec<_>>()
        .join("; ")
}

/// One line per product on the shipment: `4 x 16 oz. Shampoo (PIN-100)`.
fn items(event: &Shipment) -> String {
    event
        .products
        .iter()
        .map(|product| {
            let quantity: i64 = product
                .inventory_items
                .iter()
                .filter_map(|item| item.quantity)
                .sum();
            let name = product.name.as_deref().unwrap_or_default();
            match product.sku.as_deref().or(product.reference_id.as_deref()) {
                Some(sku) if !sku.is_empty() => format!("{quantity} x {name} ({sku})"),
                _ => format!("{quantity} x {name}"),
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::fakes::{self, RecordingGorgias};

    /// Run the flow over `deliveries`, starting from the `processed_events` a
    /// previous run left in tenant metadata.
    fn run_process(
        deliveries: Vec<WebhookDelivery>,
        already_processed: Value,
        known_customers: &[&str],
    ) -> (Map<String, Value>, RecordingGorgias) {
        let gorgias = RecordingGorgias::new(known_customers);
        let now = Utc::now();
        let mut processed = prune(&already_processed, now.naive_utc());
        process(&deliveries, &gorgias, &mut processed, now);
        (processed, gorgias)
    }

    #[test]
    fn a_delivery_opens_a_ticket_and_writes_only_processed_events() {
        let (processed, gorgias) = run_process(
            vec![fakes::delivery(
                "t1",
                fakes::shipment_event(456789, "Delivered"),
            )],
            Value::Null,
            &["jane@example.com"],
        );

        let ticket = &gorgias.tickets()[0];
        assert_eq!(ticket["customer"], json!({"id": 40})); // linked to the found customer
        assert_eq!(
            ticket["tags"],
            json!([{"name": "shipbob-shipment"}, {"name": "shipbob-delivered"}])
        );
        let body = ticket["messages"][0]["body_text"].as_str().unwrap();
        assert!(body.contains("is now Delivered"));
        assert!(body.contains("Tracking: USPS 9400100000000000000000"));
        assert!(processed.contains_key("456789:Delivered"));
    }

    #[test]
    fn a_repeated_status_is_dropped_but_the_next_status_still_tickets() {
        // Dedupe is per shipment *and* status, and entries age out of the map
        // after the prune window.
        let now = Utc::now();
        let (processed, gorgias) = run_process(
            vec![
                fakes::delivery("t1", fakes::shipment_event(1, "OnHold")),
                fakes::delivery("t2", fakes::shipment_event(1, "OnHold")), // a redelivery
                fakes::delivery("t3", fakes::shipment_event(1, "Delivered")), // genuinely next
            ],
            json!({
                "2:Delivered": now.to_rfc3339(),                          // recent -> kept
                "3:Delivered": (now - TimeDelta::minutes(45)).to_rfc3339(), // stale -> pruned
            }),
            &["jane@example.com"],
        );

        assert_eq!(gorgias.tickets().len(), 2); // not three
        let mut tracked: Vec<&String> = processed.keys().collect();
        tracked.sort();
        assert_eq!(tracked, ["1:Delivered", "1:OnHold", "2:Delivered"]);
    }

    #[test]
    fn a_recipient_with_no_email_gets_a_customer_keyed_on_their_address() {
        let (processed, gorgias) = run_process(
            vec![fakes::delivery("t1", fakes::onhold_event())],
            Value::Null,
            &[],
        );

        let created = &gorgias.created()[0];
        assert!(created.get("email").is_none());
        // The synthetic key the cron flow uses too: name address1 city country.
        assert_eq!(
            created["external_id"],
            "Jane Buyer 100 Nowhere Blvd Gotham City US"
        );

        let ticket = &gorgias.tickets()[0];
        assert_eq!(ticket["customer"], json!({"id": 1000})); // the customer just created

        // The body carries only what ShipBob sent for this status.
        let body = ticket["messages"][0]["body_text"].as_str().unwrap();
        assert!(body.contains("is now OnHold"));
        assert!(body.contains("Reason: Invalid Address; Payment Failure"));
        assert!(!body.contains("Tracking:")); // an OnHold shipment carries none
        assert!(body.contains("4 x Pinnacle Shampoo (PIN-100)"));
        assert!(processed.contains_key("107414278:OnHold"));
    }
}
