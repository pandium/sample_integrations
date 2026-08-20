//! Both flows ship in one binary and are selected by Pandium's run mode

use std::process::ExitCode;

use sb2gorgias::{Pandium, cron, pandium, webhook};

fn main() -> ExitCode {
    // A local `.env`, when there is one, for use in local dev.
    // On Pandium there is no such file and this does nothing.
    dotenvy::dotenv().ok();

    // Logs go to stderr; stdout is reserved for Pandium's tenant metadata.
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .target(env_logger::Target::Stderr)
        .init();

    let pandium = Pandium::from_env();
    let mode = pandium.run_mode().unwrap_or("normal");
    log::info!("syncing ShipBob to Gorgias; this run is in mode: {mode}");

    let metadata = match mode {
        // Webhook mode: ShipBob order webhook deliveries become a Gorgias ticket
        // per new shipment status.
        "webhook" => webhook::run(&pandium),

        // Normal mode: the scheduled ShipBob orders -> Gorgias customer sync.
        _ => cron::run(&pandium),
    };

    match metadata {
        Ok(metadata) => {
            pandium::update_metadata(&metadata);
            ExitCode::SUCCESS
        }
        Err(err) => {
            log::error!("{err:#}");
            ExitCode::FAILURE
        }
    }
}
