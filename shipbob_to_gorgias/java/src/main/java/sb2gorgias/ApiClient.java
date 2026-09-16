package sb2gorgias;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

/** A small HTTP client with exponential backoff retry, scoped to one API's base URL and auth
 * header. requester is swappable so tests can stub the network without a full HTTP mock. */
final class ApiClient {
    private static final Set<Integer> RETRY_STATUSES = Set.of(429, 502, 503, 504);
    private static final int MAX_ATTEMPTS = 6;

    // A server-requested wait longer than this is not worth honoring - it would tie up the run
    // far past what our own backoff schedule ever would anyway.
    private static final Duration MAX_RETRY_AFTER = Duration.ofSeconds(60);

    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /** One raw HTTP call, decoupled from the JDK client so tests can fake it directly. */
    interface RawRequester {
        RawResponse send(String method, String url, String body) throws IOException;
    }

    /** retryAfter is the server's Retry-After value, in seconds form (the only form these
     * APIs are expected to send) - present only on a response that actually carried one. */
    record RawResponse(int status, String body, Optional<Duration> retryAfter) {
        RawResponse(int status, String body) {
            this(status, body, Optional.empty());
        }
    }

    private final String baseUrl;
    private final String authorization;
    private final Duration backoff;
    private final Set<String> retryMethods;
    RawRequester requester;

    ApiClient(String baseUrl, String authorization, Duration backoff, Set<String> retryMethods) {
        this.baseUrl = baseUrl;
        this.authorization = authorization;
        this.backoff = backoff;
        this.retryMethods = retryMethods;
        this.requester = this::jdkSend;
    }

    String authorization() {
        return authorization;
    }

    Object get(String path, Map<String, String> query) {
        StringBuilder url = new StringBuilder(baseUrl).append(path);
        if (query != null && !query.isEmpty()) {
            url.append('?');
            boolean first = true;
            for (Map.Entry<String, String> entry : query.entrySet()) {
                if (!first) {
                    url.append('&');
                }
                first = false;
                url.append(encode(entry.getKey())).append('=').append(encode(entry.getValue()));
            }
        }
        return send("GET", url.toString(), null);
    }

    Object post(String path, JSONObject body) {
        return send("POST", baseUrl + path, body == null ? null : body.toString());
    }

    Object put(String path, JSONObject body) {
        return send("PUT", baseUrl + path, body == null ? null : body.toString());
    }

    /** Retries a retryable failure with exponential backoff, or the server's own Retry-After
     * when it sends one. Stops immediately if the backoff sleep is interrupted. An empty body
     * returns null, not an error, so callers can tell "nothing here" from a real failure. */
    private Object send(String method, String url, String body) {
        RuntimeException lastError = null;
        Duration retryAfter = null;
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            if (attempt > 1) {
                Duration wait = retryAfter != null ? retryAfter : backoff.multipliedBy(1L << (attempt - 2));
                retryAfter = null;
                if (!sleep(wait)) {
                    throw lastError;
                }
            }

            RawResponse response;
            try {
                response = requester.send(method, url, body);
            } catch (IOException e) {
                lastError = new UncheckedIOException(e.getMessage(), e);
                if (retryMethods.contains(method)) {
                    continue;
                }
                throw lastError;
            }

            if (response.status() >= 400) {
                lastError = new RuntimeException("HTTP " + response.status() + ": " + response.body());
                if (RETRY_STATUSES.contains(response.status()) && retryMethods.contains(method)) {
                    retryAfter = response.retryAfter().orElse(null);
                    continue;
                }
                throw lastError;
            }

            if (response.body() == null || response.body().isBlank()) {
                return null;
            }
            try {
                return new JSONTokener(response.body()).nextValue();
            } catch (JSONException e) {
                throw new RuntimeException("could not decode response body: " + e.getMessage(), e);
            }
        }
        throw lastError;
    }

    private RawResponse jdkSend(String method, String url, String body) throws IOException {
        HttpRequest.BodyPublisher publisher = body == null
                ? HttpRequest.BodyPublishers.noBody()
                : HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8);
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("accept", "application/json")
                .header("content-type", "application/json")
                .header("Authorization", authorization)
                .method(method, publisher)
                .build();

        try {
            HttpResponse<String> res = HTTP.send(request, HttpResponse.BodyHandlers.ofString());
            return new RawResponse(res.statusCode(), res.body(), retryAfterOf(res));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException(e);
        }
    }

    /** Only the seconds form of Retry-After is handled; anything else (an HTTP-date) is
     * treated as absent rather than failing the request over it. */
    private static Optional<Duration> retryAfterOf(HttpResponse<?> res) {
        return res.headers().firstValue("Retry-After").flatMap(value -> {
            try {
                long seconds = Long.parseLong(value.trim());
                return seconds > 0
                        ? Optional.of(Duration.ofSeconds(Math.min(seconds, MAX_RETRY_AFTER.toSeconds())))
                        : Optional.<Duration>empty();
            } catch (NumberFormatException e) {
                return Optional.empty();
            }
        });
    }

    private static String encode(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    /** Returns false if interrupted mid-sleep, restoring the interrupt flag either way. */
    private static boolean sleep(Duration d) {
        try {
            Thread.sleep(d.toMillis());
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}
