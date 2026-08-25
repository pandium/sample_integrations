//! Gorgias client, and the payloads both flows send it.
//!
//! The cron flow upserts customers, writing ShipBob order history to
//! `data.pandium.shipbob_orders`; the webhook flow creates tickets.
//!
//! Auth is OAuth2 via Pandium's `gorgias-oauth` connector. Pandium runs the
//! authorization flow when the tenant connects and handles refreshes, so this 
//! client never sees a client secret, never posts to a token endpoint, and 
//! holds no refresh logic 

use std::sync::LazyLock;
use std::time::Duration;

use anyhow::{Context, Result};
use regex::Regex;
use serde_json::{Value, json};

use crate::dates;
use crate::http;
use crate::pandium::Pandium;
use crate::shipbob::{Address, Recipient};

/// Gorgias validates the shape of an email before it will store it; mirror that
/// check so the two systems agree on which recipients get an email-keyed
/// customer and which fall back to a synthetic key.
static EMAIL: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(concat!(
        r"^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|",
        "\"([\\]!#-\\[^-~ \\t]|(\\\\[\\t -~]))+\")",
        r"@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])$",
    ))
    .expect("the email pattern is a literal")
});

/// Whether Gorgias would accept `email` as an email address.
pub fn valid_email(email: &str) -> bool {
    !email.contains(".@") && EMAIL.is_match(email)
}

/// How a Gorgias customer is identified.
///
/// A ShipBob recipient often has no usable email, so both flows fall back to a
/// synthetic key built from the recipient's name and address. Making that an
/// enum rather than a pair of optional arguments means there is always exactly
/// one key, and the lookup and the created record cannot disagree about it.
pub enum CustomerKey {
    Email(String),
    ExternalId(String),
}

impl CustomerKey {
    /// A valid recipient email when there is one, otherwise a synthetic
    /// `name address1 city country`. Both flows key on this, so a webhook ticket
    /// lands on the same record that carries the customer's order history.
    pub fn for_recipient(recipient: &Recipient) -> Self {
        if let Some(email) = recipient.email.as_deref().filter(|e| valid_email(e)) {
            return Self::Email(email.to_string());
        }
        let Address {
            address1,
            city,
            country,
        } = &recipient.address;
        Self::ExternalId(
            [
                recipient.name.as_deref(),
                address1.as_deref(),
                city.as_deref(),
                country.as_deref(),
            ]
            .map(Option::unwrap_or_default)
            .join(" "),
        )
    }

    /// The key as Gorgias stores it on the customer's `external_id`.
    pub fn as_str(&self) -> &str {
        match self {
            Self::Email(email) => email,
            Self::ExternalId(external_id) => external_id,
        }
    }

    /// The query parameter `GET /customers` looks the customer up by.
    fn query(&self) -> (&'static str, String) {
        match self {
            Self::Email(email) => ("email", email.to_lowercase()),
            Self::ExternalId(external_id) => ("external_id", external_id.clone()),
        }
    }
}

/// Body for `POST /customers` when the customer does not yet exist.
pub fn new_customer_payload(recipient: &Recipient, key: &CustomerKey) -> Value {
    let mut payload = json!({
        "name": recipient.name.as_deref().unwrap_or_default(),
        "external_id": key.as_str(),
        "data": {"pandium": {"shipbob_orders": []}},
    });
    if let CustomerKey::Email(email) = key {
        payload["email"] = json!(email);
    }
    payload
}

/// One shipment as the sidebar shows it: ShipBob's own fields, with the dates
/// made readable and a deep link back into ShipBob added.
fn sidebar_shipment(shipment: &Value) -> Value {
    let mut shipment = shipment.clone();
    if let Some(fields) = shipment.as_object_mut() {
        for field in ["estimated_fulfillment_date", "actual_fulfillment_date"] {
            if let Some(value) = fields.get(field).and_then(Value::as_str) {
                let display = dates::for_display(value);
                fields.insert(field.to_string(), display.into());
            }
        }
        let id = fields
            .get("id")
            .and_then(Value::as_i64)
            .map(|id| id.to_string())
            .unwrap_or_default();
        let url = format!("https://web.shipbob.com/App/Merchant/#/Orders/{id}/");
        fields.insert("url".to_string(), url.into());
    }
    shipment
}

/// The single order entry stored in `data.pandium.shipbob_orders`.
pub fn order_entry(order: &Value) -> Value {
    let shipments: Vec<Value> = order["shipments"]
        .as_array()
        .map(Vec::as_slice)
        .unwrap_or(&[])
        .iter()
        .map(sidebar_shipment)
        .collect();

    json!({
        "id": order["id"],
        "created_date": dates::for_display(order["created_date"].as_str().unwrap_or_default()),
        "purchase_date": dates::for_display(order["purchase_date"].as_str().unwrap_or_default()),
        "reference_id": order["reference_id"],
        "order_number": order["order_number"],
        "status": order["status"],
        "type": order["type"],
        "channel": order["channel"],
        "shipping_method": order["shipping_method"],
        "recipient": order["recipient"],
        "products": order["products"],
        "tags": order["tags"],
        "shipments": shipments,
    })
}

/// The slice of Gorgias the two flows depend on: find-or-create a customer,
/// write order history onto them, open a ticket.
pub trait Helpdesk {
    /// The customer's detail record — the list endpoint omits `data`, which is
    /// where the order history lives — or `None` if there is no such customer.
    fn find_customer(&self, key: &CustomerKey) -> Result<Option<Value>>;

    /// Create the customer and return their new id.
    fn create_customer(&self, payload: &Value) -> Result<i64>;

    fn update_customer(&self, id: i64, payload: &Value) -> Result<()>;

    fn create_ticket(&self, payload: &Value) -> Result<Value>;
}

pub struct Gorgias {
    http: http::Client,
}

impl Gorgias {
    pub fn new(pandium: &Pandium) -> Result<Self> {
        let token = pandium.require_secret("gorgias_oauth_access_token")?;
        let account = pandium.require_secret("gorgias_oauth_account")?;
        // The connector reports its own scheme; every current Gorgias token is a
        // bearer, but read it rather than assume it.
        let token_type = pandium
            .secret("gorgias_oauth_token_type")
            .unwrap_or("Bearer");

        let base_url = format!("https://{}.gorgias.com/api", account.to_lowercase());
        log::info!("Gorgias API base URL: {base_url}");

        Ok(Self {
            http: http::Client::new(
                base_url,
                format!("{token_type} {token}"),
                Duration::from_secs(2),
            ),
        })
    }
}

impl Helpdesk for Gorgias {
    fn find_customer(&self, key: &CustomerKey) -> Result<Option<Value>> {
        let (parameter, value) = key.query();
        log::info!("looking for gorgias customer by {parameter} {value}");

        // An email or external_id maps to at most one customer, so there is
        // nothing to paginate through.
        let found = self.http.get("/customers", &[(parameter, value)])?;
        let Some(row) = found["data"].as_array().and_then(|rows| rows.first()) else {
            log::info!("customer not found");
            return Ok(None);
        };

        let id = row["id"].as_i64().context("Gorgias customer has no id")?;
        log::info!("customer found: {id}");
        Ok(Some(self.http.get(&format!("/customers/{id}"), &[])?))
    }

    fn create_customer(&self, payload: &Value) -> Result<i64> {
        log::info!("creating new gorgias customer");
        let created = self.http.post("/customers", payload)?;
        created["id"]
            .as_i64()
            .context("Gorgias created a customer without an id")
    }

    fn update_customer(&self, id: i64, payload: &Value) -> Result<()> {
        log::info!("updating gorgias customer {id}");
        self.http.put(&format!("/customers/{id}"), payload)?;
        Ok(())
    }

    fn create_ticket(&self, payload: &Value) -> Result<Value> {
        log::info!("creating gorgias ticket");
        self.http.post("/tickets", payload)
    }
}
