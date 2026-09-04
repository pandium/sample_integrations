//! A very small JSON-over-HTTP client, shared by the two API clients.
//!
//! Both APIs speak bearer-authenticated JSON and both rate-limit, so the only
//! things this adds over `ureq` are the standing headers and a bounded retry.

use std::thread::sleep;
use std::time::Duration;

use anyhow::{Result, anyhow};
use serde_json::Value;
use ureq::http::Response;
use ureq::{Agent, Body, RequestBuilder};

/// Statuses worth retrying: rate limiting, plus the gateway errors both APIs
/// return under load. Anything else is a real answer, retried or not.
const RETRY_STATUSES: [u16; 4] = [429, 502, 503, 504];

/// Total attempts, first included. Pandium does not retry a failed run on its
/// own, so a transient 429 has to be absorbed here or the whole run is lost.
const MAX_ATTEMPTS: u32 = 6;

pub struct Client {
    agent: Agent,
    base_url: String,
    authorization: String,
    backoff: Duration,
}

impl Client {
    /// A client for `base_url`, sending `authorization` on every request and
    /// waiting `backoff`, then double that, then double again, between retries.
    pub fn new(base_url: String, authorization: String, backoff: Duration) -> Self {
        let agent = Agent::config_builder()
            // Handle statuses here instead: a failed call should log what the
            // API actually said, and that means keeping the response body.
            .http_status_as_error(false)
            .build()
            .new_agent();
        Self {
            agent,
            base_url,
            authorization,
            backoff,
        }
    }

    pub fn get(&self, path: &str, query: &[(&str, String)]) -> Result<Value> {
        let url = self.url(path);
        self.send(|| {
            let mut request = self.headers(self.agent.get(&url));
            for (key, value) in query {
                request = request.query(key, value);
            }
            request.call()
        })
    }

    pub fn post(&self, path: &str, body: &Value) -> Result<Value> {
        let url = self.url(path);
        self.send(|| self.headers(self.agent.post(&url)).send_json(body))
    }

    pub fn put(&self, path: &str, body: &Value) -> Result<Value> {
        let url = self.url(path);
        self.send(|| self.headers(self.agent.put(&url)).send_json(body))
    }

    fn url(&self, path: &str) -> String {
        format!("{}{path}", self.base_url)
    }

    fn headers<Any>(&self, request: RequestBuilder<Any>) -> RequestBuilder<Any> {
        request
            .header("accept", "application/json")
            .header("content-type", "application/json")
            .header("authorization", &self.authorization)
    }

    /// Call `request` until it answers with something other than a retryable
    /// status, then parse the body as JSON. A non-2xx that survives the retries
    /// becomes an error carrying the status and the body, which is the pair you
    /// want in the run log when an API rejects a payload.
    fn send(&self, request: impl Fn() -> Result<Response<Body>, ureq::Error>) -> Result<Value> {
        let mut backoff = self.backoff;
        for attempt in 1..=MAX_ATTEMPTS {
            let response = request()?;
            let status = response.status().as_u16();

            if RETRY_STATUSES.contains(&status) && attempt < MAX_ATTEMPTS {
                log::warn!("HTTP {status}; retrying in {backoff:?} (attempt {attempt})");
                sleep(backoff);
                backoff *= 2;
                continue;
            }

            let body = response.into_body().read_to_string()?;
            if !(200..300).contains(&status) {
                return Err(anyhow!("HTTP {status}: {body}"));
            }
            // A 204 and some 200s come back empty; treat that as JSON null so
            // callers can index into the result either way.
            return Ok(if body.trim().is_empty() {
                Value::Null
            } else {
                serde_json::from_str(&body)?
            });
        }
        unreachable!("the loop returns or retries on every attempt")
    }
}
