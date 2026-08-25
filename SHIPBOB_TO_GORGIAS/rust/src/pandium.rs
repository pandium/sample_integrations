//! The Pandium runtime contract.
//!
//! Everything Pandium hands to an integration arrives as an environment
//! variable. `PAN_CFG_*` (config) and `PAN_SEC_*` (secrets) hold arbitrary keys
//! defined per integration, so they are looked up by name. `PAN_CTX_*` (run
//! context) is controlled by Pandium, so its values are surfaced through named,
//! typed accessors rather than raw environment lookups.

use std::collections::HashMap;
use std::env;
use std::fs;

use anyhow::{Context, Result};
use serde_json::Value;

/// One webhook delivery handed to this run: the raw request body, plus the
/// trigger `id`, which is useful for correlating with the run log.
pub struct WebhookDelivery {
    pub id: String,
    pub body: String,
}

/// Collect environment variables starting with `prefix`, stripping the prefix
/// and lower-casing the remaining key.
fn from_env(prefix: &str) -> HashMap<String, String> {
    env::vars()
        .filter_map(|(key, value)| Some((key.strip_prefix(prefix)?.to_lowercase(), value)))
        .collect()
}

pub struct Pandium {
    config: HashMap<String, String>,
    secrets: HashMap<String, String>,
    context: HashMap<String, String>,
}

impl Pandium {
    pub fn from_env() -> Self {
        Self::new(
            from_env("PAN_CFG_"),
            from_env("PAN_SEC_"),
            from_env("PAN_CTX_"),
        )
    }

    /// Build the same object from plain maps rather than from the environment.
    pub fn new(
        config: HashMap<String, String>,
        secrets: HashMap<String, String>,
        context: HashMap<String, String>,
    ) -> Self {
        Self {
            config,
            secrets,
            context,
        }
    }

    /// A config value from the connection settings form.
    pub fn config(&self, key: &str) -> Option<&str> {
        self.config.get(key).map(String::as_str)
    }

    /// A boolean config. Every config reaches the run as text, so a ticked
    /// checkbox arrives as the string `"true"`.
    pub fn config_flag(&self, key: &str) -> bool {
        self.config(key)
            .is_some_and(|value| value.eq_ignore_ascii_case("true"))
    }

    /// A secret provisioned by one of the manifest's connectors.
    pub fn secret(&self, key: &str) -> Option<&str> {
        self.secrets.get(key).map(String::as_str)
    }

    /// A secret the integration cannot run without. The error names the
    /// environment variable, so a misconfigured connector is clear in the run
    /// log rather than surfacing later as a 401.
    pub fn require_secret(&self, key: &str) -> Result<&str> {
        self.secret(key)
            .filter(|value| !value.is_empty())
            .with_context(|| format!("PAN_SEC_{} is required", key.to_uppercase()))
    }

    /// The run mode for this invocation: `init`, `normal`, or `webhook`.
    pub fn run_mode(&self) -> Option<&str> {
        self.context.get("run_mode").map(String::as_str)
    }

    /// The triggers that caused this run, parsed from JSON.
    pub fn run_triggers(&self) -> Vec<Value> {
        let Some(raw) = self.context.get("run_triggers") else {
            return Vec::new();
        };
        serde_json::from_str(raw).unwrap_or_else(|err| {
            log::error!("could not parse run triggers as JSON: {err}");
            Vec::new()
        })
    }

    /// The webhook deliveries bundled into this run.
    ///
    /// Pandium debounces triggers per tenant, so deliveries that arrive while a
    /// run is in flight are bundled into the next one — a webhook run carries N
    /// of these, not one. Pandium writes each raw request body to disk and the
    /// trigger names the file; reading it back is this method's job, so callers
    /// get the body ready to handle.
    pub fn webhook_deliveries(&self) -> Vec<WebhookDelivery> {
        let mut deliveries = Vec::new();
        for trigger in self.run_triggers() {
            if trigger["source"] != "webhook" {
                continue;
            }
            let id = trigger["id"].as_str().unwrap_or_default().to_string();
            let Some(file) = trigger["payload"]["file"].as_str() else {
                log::warn!("webhook trigger {id} has no payload file");
                continue;
            };
            match fs::read_to_string(file) {
                Ok(body) => deliveries.push(WebhookDelivery { id, body }),
                Err(err) => log::error!("could not read webhook payload {file}: {err}"),
            }
        }
        deliveries
    }

    /// Tenant metadata, typically persisted from the previous run.
    ///
    /// Missing or unreadable metadata comes back as `Value::Null`, which indexes
    /// like an empty object — so a first run needs no special case.
    pub fn metadata(&self) -> Value {
        let Some(filename) = self.context.get("tenant_metadata_file") else {
            return Value::Null;
        };
        fs::read_to_string(filename)
            .context("read")
            .and_then(|raw| Ok(serde_json::from_str(&raw)?))
            .unwrap_or_else(|err| {
                log::error!("could not read tenant metadata from {filename}: {err}");
                Value::Null
            })
    }
}

/// Merge `metadata` into the tenant metadata for the next run to read back.
///
/// Pandium captures the last line of stdout and shallow-merges what it finds 
/// there into the tenant's stored metadata, so this is the only thing a run 
/// writes to stdout — logs go to stderr.
pub fn update_metadata(metadata: &Value) {
    log::info!("updating metadata with {metadata}");
    println!("{metadata}");
}
