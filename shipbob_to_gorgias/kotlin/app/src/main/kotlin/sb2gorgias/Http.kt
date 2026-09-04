package sb2gorgias

import io.github.oshai.kotlinlogging.KotlinLogging
import java.net.URI
import java.net.URLEncoder
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Instant
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import kotlin.jvm.optionals.getOrNull
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull

private val logger = KotlinLogging.logger {}

/** Statuses worth retrying: rate limiting, plus the gateway errors both APIs return under load. */
private val RETRY_STATUSES = setOf(429, 502, 503, 504)

/**
 * Total attempts, the first included. Pandium does not retry a failed run, so a transient
 * 429 has to be absorbed here or the whole run is lost.
 */
private const val MAX_ATTEMPTS = 6

/** The longest a `Retry-After` is honoured for. */
private val MAX_RETRY_AFTER = 60.seconds

/**
 * How long [response] asked the client to wait, or `null` if it did not ask or sent a
 * header this does not understand — either way the doubling backoff is a safe fallback.
 * RFC 9110 allows both a number of seconds and an HTTP date.
 */
private fun retryAfter(response: HttpResponse<*>): Duration? {
    val header = response.headers().firstValue("retry-after").getOrNull()?.trim() ?: return null
    val seconds =
        header.toLongOrNull()
            ?: runCatching {
                ZonedDateTime.parse(header, DateTimeFormatter.RFC_1123_DATE_TIME).toEpochSecond() -
                    Instant.now().epochSecond
            }.getOrNull()
            ?: return null
    // A date that has already passed reads as a negative wait, which means "now".
    return seconds.coerceIn(0, MAX_RETRY_AFTER.inWholeSeconds).seconds
}

/**
 * A very small JSON-over-HTTP client, shared by both API clients.
 *
 * Both APIs speak bearer-authenticated JSON and both rate-limit, so all this adds over the
 * JDK's [HttpClient] are the standing headers and a bounded retry. Blocking on purpose: the
 * run is sequential from start to finish.
 */
class ApiClient(
    private val baseUrl: String,
    private val authorization: String,
    /** How long to wait before the first retry; doubled before each one after that. */
    private val backoff: Duration,
) {
    private val http: HttpClient = HttpClient.newHttpClient()

    fun get(path: String, vararg query: Pair<String, String>): JsonElement =
        send(request(path, query.toList()).GET().build())

    fun post(path: String, body: JsonElement): JsonElement =
        send(request(path).POST(HttpRequest.BodyPublishers.ofString(body.toString())).build())

    fun put(path: String, body: JsonElement): JsonElement =
        send(request(path).PUT(HttpRequest.BodyPublishers.ofString(body.toString())).build())

    private fun request(path: String, query: List<Pair<String, String>> = emptyList()): HttpRequest.Builder =
        HttpRequest.newBuilder(URI.create(baseUrl + path + queryString(query)))
            .header("accept", "application/json")
            .header("content-type", "application/json")
            .header("authorization", authorization)

    private fun queryString(query: List<Pair<String, String>>): String =
        if (query.isEmpty()) {
            ""
        } else {
            query.joinToString("&", prefix = "?") { (key, value) ->
                "$key=${URLEncoder.encode(value, Charsets.UTF_8)}"
            }
        }

    /**
     * Send [request] until it answers with something other than a retryable status, then
     * parse the body as JSON.
     *
     * A non-2xx that survives the retries throws, carrying the status and the body. Nothing
     * here maps a failure onto an empty result: the cron flow reads an empty page as "the
     * query is exhausted, commit the cursor", so the two have to stay distinct.
     */
    private fun send(request: HttpRequest): JsonElement {
        var wait = backoff
        repeat(MAX_ATTEMPTS) { attempt ->
            val response = http.send(request, HttpResponse.BodyHandlers.ofString())
            val status = response.statusCode()

            if (status in RETRY_STATUSES && attempt < MAX_ATTEMPTS - 1) {
                val pause = retryAfter(response) ?: wait
                logger.warn { "HTTP $status from ${request.uri()}; retrying in $pause (attempt ${attempt + 1})" }
                Thread.sleep(pause.inWholeMilliseconds)
                wait *= 2
                return@repeat
            }

            val body = response.body().orEmpty()
            check(status in 200..299) { "HTTP $status from ${request.uri()}: $body" }
            // A 204, and some 200s, come back empty; reading that as JSON null lets
            // callers index into the result either way.
            return if (body.isBlank()) JsonNull else json.parseToJsonElement(body)
        }
        error("the retry loop returns or retries on every attempt")
    }
}
