use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::time::{SystemTime, UNIX_EPOCH};

use serde_json::{json, Value};

use sb2gorgias::Pandium;

/// Produce a pseudo-random number seeded from the current time.
fn random_number() -> u64 {
    let mut hasher = DefaultHasher::new();
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_nanos()
        .hash(&mut hasher);
    hasher.finish() % 1_000_000
}

/// The business logic of the run varies depending on the run mode.
fn run(mode: &str, pandium: &Pandium) -> Value {
    match mode {
        // Init mode: report which secrets are available and populate tenant
        // metadata with the dynamic config values needed for the customer-facing
        // config form. In the real world, these values would be derived from an
        // api call.
        "init" => {
            eprintln!("The available secrets are: {}", pandium.secret_keys().join(", "));
            json!({
                "dynamic_colors": ["red", "green", "purple", "orange", "yellow"],
            })
        }

        // Webhook mode: each trigger's payload.file names a file holding the raw
        // webhook body; read and log it. This version emits no metadata, but there
        // is no reason not to update metadata from here.
        "webhook" => {
            for trigger in pandium.run_triggers() {
                if let Some(file) = trigger["payload"]["file"].as_str() {
                    match std::fs::read_to_string(file) {
                        Ok(payload) => eprintln!("{payload}"),
                        Err(err) => eprintln!("could not read webhook payload {file}: {err}"),
                    }
                }
            }
            json!({})
        }

        // Normal mode: log the config, then log the previous normal run's random
        // number and store a fresh random number as metadata.
        _ => {
            eprintln!("Tenant configs: {}", pandium.config_repr());
            let new_random_number = random_number();
            if let Some(metadata) = pandium.metadata() {
                eprintln!("last run's random number: {}", metadata["random_number"]);
            }
            eprintln!("new random number: {}", new_random_number);
            json!({ "random_number": new_random_number})
        }
    }
}

fn main() {
    let pandium = Pandium::from_env();

    let run_mode = pandium.run_mode().unwrap_or_default();

    eprintln!("Hello from a Pandium integration, written in Rust!");
    eprintln!("This run is in mode:  {run_mode}");

    let std_out = run(run_mode, &pandium);
    println!("{std_out}");
}
