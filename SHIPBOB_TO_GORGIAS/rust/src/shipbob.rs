//! ShipBob client, and the ShipBob shapes this integration reads.
//!
//! Auth is a single bearer token (`PAN_SEC_SHIPBOB_ACCESS_TOKEN`). The base URL
//! is resolved from the token's issuer (`iss`) claim, so the same code targets
//! prod, sandbox, or QA depending on which token the tenant connected.
//!
//! Two styles of deserialisation live here, and which one applies depends on
//! what the flow does with the data. A webhook body is small, fully specified,
//! and every field drives a decision, so it gets real types ([`Shipment`]) and
//! the compiler checks the field-presence logic. An order, by contrast, is
//! mostly *passed through* to the Gorgias sidebar unread, so it stays raw
//! [`Value`] and only the parts the integration acts on — the [`Recipient`], the
//! timestamps — are pulled out.

use std::cmp::Reverse;
use std::time::Duration;

use anyhow::Result;
use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use chrono::{NaiveDateTime, Utc};
use serde::{Deserialize, Deserializer};
use serde_json::Value;

use crate::dates;
use crate::http;
use crate::pandium::Pandium;

/// ShipBob issues tokens from a different auth host per environment; map each to
/// its matching API base URL.
const AUTH_URL_TO_BASE_URL: [(&str, &str); 2] = [
    (
        "https://authstage.shipbob.com",
        "https://sandbox-api.shipbob.com/2026-01",
    ),
    (
        "https://auth.shipbob.com",
        "https://api.shipbob.com/2026-01",
    ),
];

pub const DEFAULT_BASE_URL: &str = "https://api.shipbob.com/2026-01";

/// Decode the JWT payload and map its `iss` claim to an API base URL. Anything
/// unrecognised — or a token too malformed to read — falls back to production.
pub fn resolve_base_url(token: &str) -> &'static str {
    let claims = || -> Result<Value> {
        let payload = token.split('.').nth(1).unwrap_or_default();
        Ok(serde_json::from_slice(&URL_SAFE_NO_PAD.decode(payload)?)?)
    };
    let issuer = match claims() {
        Ok(claims) => claims["iss"].as_str().unwrap_or_default().to_string(),
        Err(err) => {
            log::warn!("could not resolve ShipBob base URL from token: {err}");
            return DEFAULT_BASE_URL;
        }
    };
    AUTH_URL_TO_BASE_URL
        .iter()
        .find(|(auth_url, _)| *auth_url == issuer)
        .map_or(DEFAULT_BASE_URL, |(_, base_url)| *base_url)
}

// --- the shapes this integration reads ---------------------------------------

/// Deserialize a field that may be missing *or* explicitly `null`. ShipBob uses
/// the two interchangeably — an OnHold shipment sends `"tracking": null` where
/// another topic simply omits the key.
fn or_default<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: Deserialize<'de> + Default,
{
    Ok(Option::<T>::deserialize(deserializer)?.unwrap_or_default())
}

/// Who the order or shipment is going to. Both flows key their Gorgias customer
/// off this, which is why it is shared rather than living on [`Shipment`].
#[derive(Debug, Default, Deserialize)]
pub struct Recipient {
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub email: Option<String>,
    #[serde(default, deserialize_with = "or_default")]
    pub address: Address,
}

#[derive(Debug, Default, Deserialize)]
pub struct Address {
    #[serde(default)]
    pub address1: Option<String>,
    #[serde(default)]
    pub city: Option<String>,
    #[serde(default)]
    pub country: Option<String>,
}

impl Recipient {
    /// Read the recipient off a raw ShipBob order. `serde_json` can deserialize
    /// straight out of a borrowed [`Value`], so pulling one typed field out of
    /// otherwise-untyped JSON costs nothing but the strings it copies.
    pub fn of(order: &Value) -> Self {
        Self::deserialize(&order["recipient"]).unwrap_or_default()
    }
}

/// The shipment ShipBob sends on every order-related webhook topic.
///
/// `order_shipped`, `shipment_delivered`, `shipment_exception`,
/// `shipment_onhold`, and `shipment_cancelled` all deliver this same object and
/// differ only in `status` and `status_details`.
#[derive(Debug, Deserialize)]
pub struct Shipment {
    /// ShipBob names this `id` on the webhook body; older docs and some topics
    /// call it `shipment_id`.
    #[serde(default, alias = "shipment_id")]
    pub id: Option<i64>,
    #[serde(default)]
    pub order_id: Option<i64>,
    #[serde(default)]
    pub reference_id: Option<String>,
    #[serde(default)]
    pub status: Option<String>,
    #[serde(default, deserialize_with = "or_default")]
    pub status_details: Vec<StatusDetail>,
    #[serde(default)]
    pub tracking: Option<Tracking>,
    #[serde(default)]
    pub delivery_date: Option<String>,
    #[serde(default, deserialize_with = "or_default")]
    pub products: Vec<Product>,
    #[serde(default, deserialize_with = "or_default")]
    pub recipient: Recipient,
}

/// One reason ShipBob attached to a status, e.g. `Invalid Address`. Statuses
/// that speak for themselves, such as `Delivered`, carry none.
#[derive(Debug, Deserialize)]
pub struct StatusDetail {
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct Tracking {
    #[serde(default)]
    pub carrier: Option<String>,
    #[serde(default)]
    pub tracking_number: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct Product {
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub sku: Option<String>,
    #[serde(default)]
    pub reference_id: Option<String>,
    #[serde(default, deserialize_with = "or_default")]
    pub inventory_items: Vec<InventoryItem>,
}

#[derive(Debug, Deserialize)]
pub struct InventoryItem {
    #[serde(default)]
    pub quantity: Option<i64>,
}

impl Shipment {
    /// The status this topic is reporting. ShipBob always sends one; the
    /// fallback only covers a body that arrives without it.
    pub fn reported_status(&self) -> &str {
        self.status.as_deref().unwrap_or("Updated")
    }

    /// The merchant's own order reference, falling back to ShipBob's order id.
    pub fn order_reference(&self) -> String {
        self.reference_id
            .clone()
            .filter(|reference| !reference.is_empty())
            .or_else(|| self.order_id.map(|id| id.to_string()))
            .unwrap_or_default()
    }

    /// The delivery date as `YYYY-MM-DD`. Only `Delivered` shipments carry one.
    pub fn delivered_on(&self) -> Option<&str> {
        self.delivery_date.as_deref()?.get(..10)
    }
}

// --- the client ---------------------------------------------------------------

/// The slice of ShipBob the cron flow depends on. Narrow enough that the tests
/// can serve canned pages without a network or a token.
pub trait Orders {
    /// One page of orders created since `start_date`, oldest first.
    fn new_orders_page(&self, start_date: NaiveDateTime, page: u32) -> Vec<Value>;

    /// One page of orders updated since `start_date`, newest update first.
    fn updated_orders_page(&self, start_date: NaiveDateTime, page: u32) -> Vec<Value>;
}

pub struct ShipBob {
    http: http::Client,
}

impl ShipBob {
    pub fn new(pandium: &Pandium) -> Result<Self> {
        let token = pandium.require_secret("shipbob_access_token")?;
        let base_url = resolve_base_url(token).to_string();
        log::info!("ShipBob API base URL: {base_url}");
        Ok(Self {
            http: http::Client::new(base_url, format!("Bearer {token}"), Duration::from_secs(3)),
        })
    }

    /// GET one page of `/order`. A failure ends the loop that calls this with
    /// the cursor untouched, so the next run retries the same page rather than
    /// skipping past it.
    fn orders(&self, query: &[(&str, String)]) -> Vec<Value> {
        match self.http.get("/order", query) {
            Ok(Value::Array(orders)) => orders,
            Ok(_) => Vec::new(),
            Err(err) => {
                log::error!("ShipBob order fetch failed ({query:?}): {err:#}");
                Vec::new()
            }
        }
    }
}

impl Orders for ShipBob {
    fn new_orders_page(&self, start_date: NaiveDateTime, page: u32) -> Vec<Value> {
        self.orders(&[
            ("StartDate", dates::iso(start_date)),
            ("Page", page.to_string()),
            ("SortOrder", "Oldest".to_string()),
        ])
    }

    fn updated_orders_page(&self, start_date: NaiveDateTime, page: u32) -> Vec<Value> {
        let mut orders = self.orders(&[
            ("LastUpdateStartDate", dates::iso(start_date)),
            ("Page", page.to_string()),
        ]);
        // ShipBob has no sort option for last-update, so order the page here.
        // Newest-first plus a cursor that only ever moves to the *oldest* update
        // seen keeps the sync conservative: a run cut short never skips an
        // update, at the cost of re-processing a few (which is harmless, since
        // the customer write is an idempotent PUT).
        let now = Utc::now().naive_utc();
        orders.sort_by_key(|order| Reverse(update_date(order, start_date, now)));
        orders
    }
}

/// The order's effective update time: the oldest shipment `last_update_at` that
/// still falls after `start_date`, or `now` when none qualify.
///
/// ShipBob timestamps updates on shipments rather than on the order, so an
/// order's update time has to be derived from the shipments under it.
pub fn update_date(order: &Value, start_date: NaiveDateTime, now: NaiveDateTime) -> NaiveDateTime {
    order["shipments"]
        .as_array()
        .map(Vec::as_slice)
        .unwrap_or(&[])
        .iter()
        .filter_map(|shipment| dates::parse(shipment["last_update_at"].as_str()?))
        .filter(|&updated| updated > start_date && updated < now)
        .min()
        .unwrap_or(now)
}
