//! The cron flow: ShipBob orders → the Gorgias customer sidebar.
//!
//! Keeps each Gorgias customer's `data.pandium.shipbob_orders` in sync with that
//! customer's recent ShipBob orders. Runs on a schedule and resumes where the
//! last run left off, using a cursor stored in tenant metadata.
//!
//! Pandium bounds a run at roughly ten minutes, so a tenant with a large backlog
//! will not finish in one pass. To stay resumable, the sync keeps a single
//! [`Cursors`] value current as each order is processed, and a watchdog thread
//! flushes it if the run gets close to the limit. Ending the run successfully in
//! that case is the whole point: Pandium merges a *successful* run's metadata,
//! so the next run reads the partial cursor and picks up from there. A run that
//! hits Pandium's own limit instead is marked **Failed (Timeout)** and writes
//! nothing.

use std::collections::HashMap;
use std::process;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

use anyhow::Result;
use chrono::{NaiveDateTime, TimeDelta, Utc};
use serde_json::{Value, json};

use crate::dates;
use crate::gorgias::{CustomerKey, Gorgias, Helpdesk};
use crate::pandium::{self, Pandium};
use crate::shipbob::{Orders, Recipient, ShipBob};

/// Nine minutes: a self-imposed deadline a minute inside Pandium's limit, which
/// leaves room to write the cursor before the platform stops the run.
pub const DEADLINE: Duration = Duration::from_secs(540);

/// How far back the very first sync may reach, and the floor every later cursor
/// is held to.
const MAX_LOOKBACK_DAYS: i64 = 30;

/// How many of a customer's most recent orders the sidebar keeps.
const MAX_ORDERS_TO_SYNC: usize = 10;

/// The point each of the two order queries resumes from.
///
/// The sync keeps this current as every order is processed, which is what makes
/// the flow restartable: whichever way the run ends, the cursor names the last
/// order the sync reached.
///
/// It tracks the orders the sync *attempted*, not the orders Gorgias accepted.
/// `process_order` logs a Gorgias failure and moves on, and the cursor
/// advances past that order with the rest — one unreachable customer costs that
/// customer's order rather than the remainder of the backlog.
#[derive(Debug, Clone, Copy)]
pub struct Cursors {
    pub new_orders: NaiveDateTime,
    pub updated_orders: NaiveDateTime,
}

impl Cursors {
    /// The cursor as Pandium stores it. Only these two keys are written, so the
    /// shallow merge leaves the webhook flow's `processed_events` untouched.
    pub fn as_metadata(&self) -> Value {
        json!({
            "new_order_start_date": dates::iso(self.new_orders),
            "updated_order_start_date": dates::iso(self.updated_orders),
        })
    }
}

/// Hold a cursor inside `[now - 30 days, now]`. A missing or unparseable value —
/// a first run, mostly — starts at the floor, the oldest window ever fetched.
pub fn clamp(value: Option<&str>, now: NaiveDateTime) -> NaiveDateTime {
    let floor = now - TimeDelta::days(MAX_LOOKBACK_DAYS);
    value
        .and_then(dates::parse)
        .map_or(floor, |value| value.clamp(floor, now))
}

pub fn run(pandium: &Pandium) -> Result<Value> {
    let now = Utc::now().naive_utc();
    let metadata = pandium.metadata();
    // The end user supplies the start date from the connection settings form until the first
    // run has written a cursor of its own.
    let configured = pandium
        .config("order_start_date")
        .filter(|start| !start.is_empty());
    let stored = |key: &str| {
        metadata[key]
            .as_str()
            .filter(|start| !start.is_empty())
            .map(str::to_string)
    };

    let cursors = Arc::new(Mutex::new(Cursors {
        new_orders: clamp(
            stored("new_order_start_date").as_deref().or(configured),
            now,
        ),
        updated_orders: clamp(
            stored("updated_order_start_date").as_deref().or(configured),
            now,
        ),
    }));
    flush_at_deadline(Arc::clone(&cursors), DEADLINE);

    let shipbob = ShipBob::new(pandium)?;
    let gorgias = Gorgias::new(pandium)?;
    let newest_first = pandium.config_flag("newest_order_first");

    sync(&shipbob, &gorgias, &cursors, newest_first, now);

    // Reached the end in time; the watchdog dies with the process on return.
    let cursors = *cursors.lock().unwrap();
    Ok(cursors.as_metadata())
}

/// Flush the cursor and end the run successfully if the sync is still going when
/// `deadline` passes.
///
/// This is the Rust shape of the pattern: the sync loop and the watchdog share
/// one cursor behind a `Mutex`, so the watchdog always writes whatever the loop
/// had reached. The thread is never joined — it is only there for the run that
/// does not finish, and it dies with the process when the run that does returns.
fn flush_at_deadline(cursors: Arc<Mutex<Cursors>>, deadline: Duration) {
    thread::spawn(move || {
        thread::sleep(deadline);
        log::warn!("approaching the run-time limit — flushing the cursor for the next run");
        // The same writer the normal path uses, so there is exactly one route to
        // stdout, and exit 0 so Pandium counts the run as a success and merges
        // the partial cursor.
        pandium::update_metadata(&cursors.lock().unwrap().as_metadata());
        process::exit(0);
    });
}

/// Run both halves of the sync, advancing `cursors` as each order is processed.
///
/// Split out from [`run`] so it can be driven by test doubles: everything it
/// touches arrives through the two traits.
pub fn sync(
    shipbob: &dyn Orders,
    gorgias: &dyn Helpdesk,
    cursors: &Mutex<Cursors>,
    newest_first: bool,
    now: NaiveDateTime,
) {
    // Orders for each customer batch onto a single record.
    let mut customers = HashMap::new();

    // New orders come back oldest-first, so created_date advances monotonically
    // and the last order processed is the right place to resume from.
    let start = cursors.lock().unwrap().new_orders;
    log::info!("syncing new ShipBob orders since {}", dates::iso(start));
    for page in 1.. {
        let orders = shipbob.new_orders_page(start, page);
        if orders.is_empty() {
            break;
        }
        for order in &orders {
            log::info!("processing new order with id {}", order["id"]);
            process_order(order, gorgias, &mut customers, newest_first);
            if let Some(created) = order["created_date"].as_str().and_then(dates::parse) {
                cursors.lock().unwrap().new_orders = created;
            }
        }
    }

    // Updated orders are sorted newest-first within a page but not across pages,
    // so the cursor has to be the running *minimum* over every order processed —
    // not whatever the last one happened to carry. Tracked separately from the
    // cursor because every update is by construction later than the starting
    // point: folding that starting value into the minimum would pin the cursor
    // there forever.
    let start = cursors.lock().unwrap().updated_orders;
    log::info!("syncing updated ShipBob orders since {}", dates::iso(start));
    let mut oldest_update: Option<NaiveDateTime> = None;
    for page in 1.. {
        let orders = shipbob.updated_orders_page(start, page);
        if orders.is_empty() {
            break;
        }
        for order in &orders {
            log::info!("processing updated order with id {}", order["id"]);
            process_order(order, gorgias, &mut customers, newest_first);

            let updated = crate::shipbob::update_date(order, start, now);
            if oldest_update.is_none_or(|oldest| updated < oldest) {
                oldest_update = Some(updated);
                cursors.lock().unwrap().updated_orders = updated;
            }
        }
    }
}

/// Find-or-create the order's Gorgias customer, then write their updated
/// `data.pandium.shipbob_orders` back.
///
/// Every Gorgias failure here is logged and swallowed so that the sync keeps
/// going. The order is not picked up again on the next run: see [`Cursors`] for
/// what that means for the cursor.
fn process_order(
    order: &Value,
    gorgias: &dyn Helpdesk,
    customers: &mut HashMap<String, Value>,
    newest_first: bool,
) {
    let recipient = Recipient::of(order);
    let key = CustomerKey::for_recipient(&recipient);

    if !customers.contains_key(key.as_str()) {
        let found = match gorgias.find_customer(&key) {
            Ok(found) => found,
            Err(err) => {
                log::error!(
                    "skipping order {} — cannot fetch customer {}: {err:#}",
                    order["id"],
                    key.as_str()
                );
                return;
            }
        };
        let customer = match found {
            Some(customer) => json!({"id": customer["id"], "data": sidebar_data(&customer)}),
            None => crate::gorgias::new_customer_payload(&recipient, &key),
        };
        customers.insert(key.as_str().to_string(), customer);
    }

    let customer = customers.get_mut(key.as_str()).expect("just inserted");
    upsert(
        &mut customer["data"]["pandium"]["shipbob_orders"],
        crate::gorgias::order_entry(order),
        newest_first,
    );

    let result = match customer["id"].as_i64() {
        Some(id) => gorgias.update_customer(id, customer),
        None => gorgias.create_customer(customer).map(|id| {
            // Remember the new id so the next order for this customer updates
            // the record instead of creating a second one.
            customer["id"] = id.into();
        }),
    };
    if let Err(err) = result {
        log::error!(
            "failed to upsert Gorgias customer {}: {err:#}",
            key.as_str()
        );
    }
}

/// An existing customer's `data`, with the path this integration owns made safe
/// to write to.
///
/// Anything already under `data.pandium` came from outside this integration — a
/// hand-edited customer can carry `{"pandium": null}` — so every level is
/// checked rather than just the leaf, and keys the integration does not own are
/// left where they are.
fn sidebar_data(customer: &Value) -> Value {
    let mut data = customer["data"].clone();
    if !data.is_object() {
        data = json!({});
    }
    if !data["pandium"].is_object() {
        data["pandium"] = json!({});
    }
    if !data["pandium"]["shipbob_orders"].is_array() {
        data["pandium"]["shipbob_orders"] = json!([]);
    }
    data
}

/// Merge `entry` into a customer's order list — replacing the order with the
/// same id, or adding it and trimming the list back to the most recent
/// [`MAX_ORDERS_TO_SYNC`].
fn upsert(orders: &mut Value, entry: Value, newest_first: bool) {
    let Some(orders) = orders.as_array_mut() else {
        return;
    };

    if let Some(existing) = orders.iter_mut().find(|order| order["id"] == entry["id"]) {
        *existing = entry; // replaced in place: order and length are unchanged
        return;
    }

    orders.push(entry);
    orders.sort_by_key(|order| order["id"].as_i64().unwrap_or_default());
    if newest_first {
        orders.reverse();
    }
    if orders.len() > MAX_ORDERS_TO_SYNC {
        // The list is sorted, so the orders to drop are always at the far end.
        match newest_first {
            true => orders.truncate(MAX_ORDERS_TO_SYNC),
            false => drop(orders.drain(..orders.len() - MAX_ORDERS_TO_SYNC)),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::fakes::{self, RecordingGorgias};

    fn at(value: &str) -> NaiveDateTime {
        dates::parse(value).expect("a test timestamp")
    }

    fn cursors_from(start: &str) -> Arc<Mutex<Cursors>> {
        Arc::new(Mutex::new(Cursors {
            new_orders: at(start),
            updated_orders: at(start),
        }))
    }

    /// Run the sync the way a tenant with the default settings would: oldest
    /// first, and a `now` comfortably later than every timestamp in the fixtures.
    fn run_sync(shipbob: &dyn Orders, gorgias: &dyn Helpdesk, cursors: &Mutex<Cursors>) {
        sync(shipbob, gorgias, cursors, false, at("2026-07-20T00:00:00"));
    }

    #[test]
    fn the_sync_pages_until_empty_and_keeps_the_cursor_current_as_it_goes() {
        // Advancing the cursor per order rather than once at the end is what
        // makes the flow resumable.
        let shipbob = fakes::ShipBob::with_new_orders(vec![
            vec![fakes::order(1, "2026-07-05T10:00:00Z", Some("j@x.com"))],
            vec![fakes::order(2, "2026-07-06T10:00:00Z", Some("j@x.com"))],
        ]);
        let gorgias = RecordingGorgias::new(&[]);
        let cursors = cursors_from("2026-07-01");
        shipbob.watch(Arc::clone(&cursors));

        run_sync(&shipbob, &gorgias, &cursors);

        assert_eq!(shipbob.new_order_pages_requested(), [1, 2, 3]); // until empty

        // What a flush would have written when page 2 was fetched: order 1 done.
        assert_eq!(
            shipbob
                .cursor_when_page_fetched(2)
                .map(dates::iso)
                .as_deref(),
            Some("2026-07-05T10:00:00")
        );
        assert_eq!(
            cursors.lock().unwrap().as_metadata()["new_order_start_date"],
            "2026-07-06T10:00:00"
        );

        // Both orders batch onto one customer: created once, then updated.
        assert_eq!(gorgias.created().len(), 1);
        let (_, customer) = gorgias.updated().pop().expect("the second order updates");
        let synced = &customer["data"]["pandium"]["shipbob_orders"];
        assert_eq!(synced.as_array().unwrap().len(), 2);
    }

    #[test]
    fn the_updated_cursor_lands_on_the_oldest_update_across_every_page() {
        // Pages are each sorted newest-first, but not relative to each other, so
        // the cursor has to be the oldest update seen anywhere.
        let updated = |id, day| {
            fakes::order_updated_on(id, &format!("2026-07-{day:02}T00:00:00Z"), "j@x.com")
        };
        let shipbob = fakes::ShipBob::with_updated_orders(vec![
            vec![updated(1, 18), updated(2, 17)],
            vec![updated(3, 11), updated(4, 12)], // the oldest update overall
            vec![updated(5, 16)],                 // newer again, after the oldest page
        ]);
        let cursors = cursors_from("2026-07-01");

        run_sync(&shipbob, &RecordingGorgias::new(&[]), &cursors);

        assert_eq!(
            cursors.lock().unwrap().as_metadata()["updated_order_start_date"],
            "2026-07-11T00:00:00" // not order 5, the last one processed
        );
    }
}
