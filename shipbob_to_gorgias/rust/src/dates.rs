//! Timestamp parsing and formatting shared by both flows.
//!
//! Between them the two APIs and the connection settings form send RFC 3339 with
//! an offset (`2026-07-05T10:00:00.1234567+00:00`), the same without one, and a
//! bare `2026-07-01`. Everything is normalized to naive UTC here so that
//! comparing cursors never has to think about offsets.

use chrono::{DateTime, NaiveDate, NaiveDateTime, SubsecRound};

/// Parse a timestamp from either API into naive UTC, or `None` if it is not a
/// shape we recognize.
pub fn parse(value: &str) -> Option<NaiveDateTime> {
    if let Ok(with_offset) = DateTime::parse_from_rfc3339(value) {
        return Some(with_offset.naive_utc());
    }
    if let Ok(naive) = NaiveDateTime::parse_from_str(value, "%Y-%m-%dT%H:%M:%S%.f") {
        return Some(naive);
    }
    NaiveDate::parse_from_str(value, "%Y-%m-%d")
        .ok()
        .and_then(|date| date.and_hms_opt(0, 0, 0))
}

/// Render a timestamp the way the metadata cursor and ShipBob's query
/// parameters want it.
pub fn iso(value: NaiveDateTime) -> String {
    value
        .trunc_subsecs(6)
        .format("%Y-%m-%dT%H:%M:%S%.f")
        .to_string()
}

/// Render a ShipBob timestamp for the Gorgias customer sidebar, passing anything
/// unparseable through unchanged.
pub fn for_display(value: &str) -> String {
    match parse(value) {
        Some(parsed) => parsed.format("%d/%m/%Y %H:%M:%S UTC").to_string(),
        None => value.to_string(),
    }
}
