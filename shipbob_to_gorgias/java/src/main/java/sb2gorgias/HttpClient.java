package sb2gorgias;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;

/** A small HTTP client with exponential backoff retry, scoped to one API's base URL and auth
 * header. requester is swappable so tests can stub the network without a full HTTP mock. */
final class HttpClient {
    private static final Set<Integer> RETRY_STATUSES = Set.of(429, 502, 503, 504);
    private static final int MAX_ATTEMPTS = 6;

    /** One raw HTTP call, decoupled from Unirest so tests can fake it directly. */
    interface RawRequester {
        RawResponse send(String method, String url, String body) throws IOException;
    }

    record RawResponse(int status, String body) {
    }

    private final String baseUrl;
    private final String authorization;
    private final Duration backoff;
    private final Set<String> retryMethods;
    RawRequester requester;

    HttpClient(String baseUrl, String authorization, Duration backoff, Set<String> retryMethods) {
        this.baseUrl = baseUrl;
        this.authorization = authorization;
        this.backoff = backoff;
        this.retryMethods = retryMethods;
        this.requester = this::unirestSend;
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

    /** Performs one request, retrying on a network error or a retryable status code when the
     * method is allowed to retry. Backoff is backoff * 2^(attempt-2) for attempts after the
     * first, no jitter. A response with an empty body returns null, not an error - that's what
     * lets a caller distinguish "genuinely nothing here" from a real failure. */
    private Object send(String method, String url, String body) {
        RuntimeException lastError = null;
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            if (attempt > 1) {
                sleep(backoff.multipliedBy(1L << (attempt - 2)));
            }

            RawResponse response;
            try {
                response = requester.send(method, url, body);
            } catch (IOException e) {
                lastError = new RuntimeException(e.getMessage(), e);
                if (retryMethods.contains(method)) {
                    continue;
                }
                throw lastError;
            }

            if (response.status() >= 400) {
                lastError = new RuntimeException("HTTP " + response.status() + ": " + response.body());
                if (RETRY_STATUSES.contains(response.status()) && retryMethods.contains(method)) {
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

    private RawResponse unirestSend(String method, String url, String body) throws IOException {
        try {
            HttpResponse<String> res = switch (method) {
                case "GET" -> Unirest.get(url).headers(headers()).asString();
                case "POST" -> Unirest.post(url).headers(headers()).body(body == null ? "" : body).asString();
                case "PUT" -> Unirest.put(url).headers(headers()).body(body == null ? "" : body).asString();
                default -> throw new IllegalArgumentException("unsupported method: " + method);
            };
            return new RawResponse(res.getStatus(), res.getBody());
        } catch (UnirestException e) {
            throw new IOException(e);
        }
    }

    private Map<String, String> headers() {
        return Map.of("accept", "application/json", "content-type", "application/json", "Authorization", authorization);
    }

    private static String encode(String s) {
        return java.net.URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    private static void sleep(Duration d) {
        try {
            Thread.sleep(d.toMillis());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
