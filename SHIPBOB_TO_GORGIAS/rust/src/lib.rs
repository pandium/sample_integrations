//! ShipBob to Gorgias — a Pandium sample integration.
//!
//! Two flows share one binary and are selected by the run mode:
//!
//! * [`cron`] — the scheduled sync that writes each customer's recent ShipBob
//!   orders onto their Gorgias record, resuming where the last run stopped.
//! * [`webhook`] — a Gorgias ticket for every ShipBob shipment status change.
//!
//! [`pandium`] is the file to read first: it is the whole platform contract in
//! one place — config, secrets, run context, and the single stdout write that
//! hands metadata back to Pandium.

pub mod cron;
pub mod dates;
pub mod gorgias;
pub mod http;
pub mod pandium;
pub mod shipbob;
pub mod webhook;

#[cfg(test)]
mod fakes;

pub use pandium::Pandium;
