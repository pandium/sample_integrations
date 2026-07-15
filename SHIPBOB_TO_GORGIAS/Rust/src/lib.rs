use std::collections::HashMap;
use std::env;

use serde_json::{from_str, Value};

/// A bag of key/value pairs collected from environment variables sharing a
/// common prefix. Pandium exposes config, secrets, and context to the
/// integration this way.
struct Item {
    items: HashMap<String, String>,
}

impl Item {
    /// Collect every environment variable starting with `prefix`, stripping the
    /// prefix and lower-casing the remaining key.
    fn from_env(prefix: &str) -> Self {
        let items = env::vars()
            .filter_map(|(key, value)| {
                let stripped = key.strip_prefix(prefix)?;
                Some((stripped.to_lowercase(), value))
            })
            .collect();
        Self { items }
    }

    /// Look up a single value by its (prefix-stripped, lower-cased) key.
    fn get(&self, key: &str) -> Option<&str> {
        self.items.get(key).map(String::as_str)
    }

    /// Every (prefix-stripped, lower-cased) key.
    fn keys(&self) -> Vec<&str> {
        self.items.keys().map(String::as_str).collect()
    }

    /// A human-readable, comma-separated rendering of every key/value pair.
    fn repr(&self) -> String {
        self.items
            .iter()
            .map(|(key, value)| format!("{key}: {value}"))
            .collect::<Vec<_>>()
            .join(", ")
    }
}

/// Everything Pandium hands to an integration at runtime. Config (`PAN_CFG_*`)
/// and secrets (`PAN_SEC_*`) hold arbitrary keys defined per integration, so
/// they are looked up by free-text name. Context (`PAN_CTX_*`) is controlled by
/// Pandium, so its values are exposed through consistently named functions.
pub struct Pandium {
    config: Item,
    secrets: Item,
    context: Item,
}

impl Pandium {
    pub fn from_env() -> Self {
        Self {
            config: Item::from_env("PAN_CFG_"),
            secrets: Item::from_env("PAN_SEC_"),
            context: Item::from_env("PAN_CTX_"),
        }
    }

    /// Look up a config value by name.
    pub fn config(&self, key: &str) -> Option<&str> {
        self.config.get(key)
    }

    /// Look up a secret value by name.
    pub fn secret(&self, key: &str) -> Option<&str> {
        self.secrets.get(key)
    }

    /// The run mode for this invocation (e.g. `init`, `webhook`).
    pub fn run_mode(&self) -> Option<&str> {
        self.context.get("run_mode")
    }

    /// The triggers that caused this run, parsed from JSON. Relevant for webhook
    /// invocations, where each trigger's `payload.file` names a file holding the
    /// raw webhook body.
    pub fn run_triggers(&self) -> Vec<Value> {
        self.context
            .get("run_triggers")
            .and_then(|raw| from_str::<Vec<Value>>(raw).ok())
            .unwrap_or_default()
    }

    /// The tenant metadata persisted by the previous run, parsed as JSON.
    pub fn metadata(&self) -> Option<Value> {
        let filename = self.context.get("tenant_metadata_file")?;
        let raw = std::fs::read_to_string(filename).ok()?;
        from_str(&raw).ok()
    }

    /// A human-readable rendering of every config key/value pair.
    pub fn config_repr(&self) -> String {
        self.config.repr()
    }

    /// The names of every available secret, values omitted.
    pub fn secret_keys(&self) -> Vec<&str> {
        self.secrets.keys()
    }
}
