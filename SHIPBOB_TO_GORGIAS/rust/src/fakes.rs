//! Test doubles and factories shared by the unit tests. Nothing here touches
//! the network, the filesystem, or the environment.
//!
//! The doubles implement the same [`Orders`] and [`Helpdesk`] traits the real
//! clients do, so the flows under test run their real logic — only the two API
//! calls at the edges are swapped for recorders.

use std::cell::RefCell;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use anyhow::Result;
use chrono::NaiveDateTime;
use serde_json::{Value, json};

use crate::cron::Cursors;
use crate::gorgias::{CustomerKey, Helpdesk};
use crate::pandium::WebhookDelivery;
use crate::shipbob::Orders;

// --- ShipBob ------------------------------------------------------------------

/// Serves canned pages of orders and records which pages were asked for.
#[derive(Default)]
pub struct ShipBob {
    new_pages: Vec<Vec<Value>>,
    updated_pages: Vec<Vec<Value>>,
    requested: RefCell<Vec<u32>>,
    /// The live cursor, when a test wants to see where it stood mid-sync.
    watched: RefCell<Option<Arc<Mutex<Cursors>>>>,
    observed: RefCell<Vec<(u32, NaiveDateTime)>>,
}

// Only the new-orders half is instrumented; the updated-orders half is served
// from its own canned pages and observed through the cursor instead.

impl ShipBob {
    pub fn with_new_orders(pages: Vec<Vec<Value>>) -> Self {
        Self {
            new_pages: pages,
            ..Self::default()
        }
    }

    pub fn with_updated_orders(pages: Vec<Vec<Value>>) -> Self {
        Self {
            updated_pages: pages,
            ..Self::default()
        }
    }

    /// Record where the shared cursor stood each time a page is fetched — which
    /// is what the deadline watchdog would have flushed at that moment.
    pub fn watch(&self, cursors: Arc<Mutex<Cursors>>) {
        *self.watched.borrow_mut() = Some(cursors);
    }

    /// The new-order pages the sync asked for, in order.
    pub fn new_order_pages_requested(&self) -> Vec<u32> {
        self.requested.borrow().clone()
    }

    /// Where the shared cursor stood when the sync fetched `page`.
    pub fn cursor_when_page_fetched(&self, page: u32) -> Option<NaiveDateTime> {
        self.observed
            .borrow()
            .iter()
            .find(|(fetched, _)| *fetched == page)
            .map(|(_, cursor)| *cursor)
    }

    fn page_of(pages: &[Vec<Value>], page: u32) -> Vec<Value> {
        pages.get(page as usize - 1).cloned().unwrap_or_default()
    }
}

impl Orders for ShipBob {
    fn new_orders_page(&self, _start_date: NaiveDateTime, page: u32) -> Vec<Value> {
        self.requested.borrow_mut().push(page);
        if let Some(cursors) = self.watched.borrow().as_ref() {
            let cursor = cursors.lock().unwrap().new_orders;
            self.observed.borrow_mut().push((page, cursor));
        }
        Self::page_of(&self.new_pages, page)
    }

    fn updated_orders_page(&self, _start_date: NaiveDateTime, page: u32) -> Vec<Value> {
        Self::page_of(&self.updated_pages, page)
    }
}

// --- Gorgias ------------------------------------------------------------------

/// A [`Helpdesk`] that keeps every call in memory. `known` names customers that
/// already exist; they are found at ids 40, 41, and so on.
pub struct RecordingGorgias {
    customers: RefCell<HashMap<String, i64>>,
    created: RefCell<Vec<Value>>,
    updated: RefCell<Vec<(i64, Value)>>,
    tickets: RefCell<Vec<Value>>,
}

impl RecordingGorgias {
    pub fn new(known: &[&str]) -> Self {
        let customers = known
            .iter()
            .enumerate()
            .map(|(offset, key)| (key.to_string(), 40 + offset as i64))
            .collect();
        Self {
            customers: RefCell::new(customers),
            created: RefCell::new(Vec::new()),
            updated: RefCell::new(Vec::new()),
            tickets: RefCell::new(Vec::new()),
        }
    }

    pub fn created(&self) -> Vec<Value> {
        self.created.borrow().clone()
    }

    pub fn updated(&self) -> Vec<(i64, Value)> {
        self.updated.borrow().clone()
    }

    pub fn tickets(&self) -> Vec<Value> {
        self.tickets.borrow().clone()
    }
}

impl Helpdesk for RecordingGorgias {
    fn find_customer(&self, key: &CustomerKey) -> Result<Option<Value>> {
        Ok(self
            .customers
            .borrow()
            .get(key.as_str())
            .map(|id| json!({"id": id, "data": {"pandium": {"shipbob_orders": []}}})))
    }

    fn create_customer(&self, payload: &Value) -> Result<i64> {
        let id = 1000 + self.created.borrow().len() as i64;
        if let Some(key) = payload["external_id"].as_str() {
            self.customers.borrow_mut().insert(key.to_string(), id);
        }
        self.created.borrow_mut().push(payload.clone());
        Ok(id)
    }

    fn update_customer(&self, id: i64, payload: &Value) -> Result<()> {
        self.updated.borrow_mut().push((id, payload.clone()));
        Ok(())
    }

    fn create_ticket(&self, payload: &Value) -> Result<Value> {
        self.tickets.borrow_mut().push(payload.clone());
        Ok(json!({"id": 900 + self.tickets.borrow().len() as i64}))
    }
}

// --- payload factories ---------------------------------------------------------

/// A ShipBob order as the cron flow sees it.
pub fn order(id: i64, created: &str, email: Option<&str>) -> Value {
    json!({
        "id": id,
        "created_date": created,
        "reference_id": format!("REF-{id}"),
        "recipient": {
            "name": "Buyer",
            "email": email,
            "address": {"address1": "1 Main St", "city": "NY", "country": "US"},
        },
        "shipments": [{"id": id * 10, "last_update_at": created}],
    })
}

/// The same order, with its shipment updated at a different time than it was
/// created — which is what the updated-orders cursor keys off.
pub fn order_updated_on(id: i64, updated: &str, email: &str) -> Value {
    let mut order = order(id, "2026-07-01T00:00:00Z", Some(email));
    order["shipments"][0]["last_update_at"] = json!(updated);
    order
}

/// A ShipBob shipment webhook body. Every order-related topic delivers this same
/// object; `status` and `status_details` are what vary between them.
pub fn shipment_event(shipment_id: i64, status: &str) -> Value {
    json!({
        "id": shipment_id,
        "order_id": 289012345,
        "reference_id": "MERCHANT-ORDER-1001",
        "status": status,
        "status_details": [],
        "tracking": {"carrier": "USPS", "tracking_number": "9400100000000000000000"},
        "delivery_date": "2026-07-09T18:22:00Z",
        "products": [{
            "name": "Pinnacle Shampoo",
            "sku": "PIN-100",
            "inventory_items": [{"name": "Pinnacle Shampoo", "quantity": 4}],
        }],
        "recipient": {
            "name": "Jane Buyer",
            "email": "jane@example.com",
            "address": {"address1": "100 Nowhere Blvd", "city": "Gotham City", "country": "US"},
        },
    })
}

/// The harder shape: status details, no tracking, and no recipient email.
pub fn onhold_event() -> Value {
    let mut event = shipment_event(107414278, "OnHold");
    event["status_details"] = json!([
        {"id": 401, "name": "InvalidAddress", "description": "Invalid Address"},
        {"id": 400, "name": "PaymentDeclined", "description": "Payment Failure"},
    ]);
    event["tracking"] = Value::Null;
    event["delivery_date"] = Value::Null;
    event["recipient"]["email"] = Value::Null;
    event
}

/// An event wrapped the way Pandium hands one to a run. The real thing arrives
/// as a file path, which [`Pandium::webhook_deliveries`] has already read back.
pub fn delivery(id: &str, event: Value) -> WebhookDelivery {
    WebhookDelivery {
        id: id.to_string(),
        body: event.to_string(),
    }
}
