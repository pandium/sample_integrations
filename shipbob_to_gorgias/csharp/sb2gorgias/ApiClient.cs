using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

namespace Sb2Gorgias;

/// <summary>
/// A very small JSON-over-HTTP client, shared by both API clients.
///
/// Both APIs speak bearer-authenticated JSON and both rate-limit, so all this adds over
/// <see cref="HttpClient"/> are the standing headers and a bounded retry.
/// </summary>
public sealed class ApiClient : IDisposable
{
    /// <summary>Statuses worth retrying: rate limiting, plus the gateway errors both APIs return under load.</summary>
    private static readonly HashSet<HttpStatusCode> RetryStatuses =
    [
        HttpStatusCode.TooManyRequests,
        HttpStatusCode.BadGateway,
        HttpStatusCode.ServiceUnavailable,
        HttpStatusCode.GatewayTimeout,
    ];

    /// <summary>
    /// Total attempts, the first included. Pandium does not retry a failed run, so a
    /// transient 429 has to be absorbed here or the whole run is lost.
    /// </summary>
    private const int MaxAttempts = 6;

    /// <summary>The longest a <c>Retry-After</c> is honoured for.</summary>
    private static readonly TimeSpan MaxRetryAfter = TimeSpan.FromSeconds(60);

    private readonly HttpClient _http;
    private readonly TimeSpan _backoff;
    private readonly ILogger _logger;

    /// <param name="baseUrl">The API root. Every path below is relative to it.</param>
    /// <param name="authorization">The standing <c>Authorization</c> header.</param>
    /// <param name="backoff">How long to wait before the first retry; doubled before each one after that.</param>
    /// <param name="logger">Where retries are announced.</param>
    public ApiClient(string baseUrl, AuthenticationHeaderValue authorization, TimeSpan backoff, ILogger logger)
    {
        _http = new HttpClient
        {
            // The trailing slash matters: without it, resolving a relative path against
            // this address would drop the last segment of the API root.
            BaseAddress = new Uri(baseUrl.TrimEnd('/') + "/"),
        };
        _http.DefaultRequestHeaders.Authorization = authorization;
        _http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _backoff = backoff;
        _logger = logger;
    }

    public Task<JsonNode?> GetAsync(string path, (string Key, string Value)[] query, CancellationToken token) =>
        SendAsync(() => new HttpRequestMessage(HttpMethod.Get, path + QueryString(query)), token);

    public Task<JsonNode?> PostAsync(string path, JsonNode body, CancellationToken token) =>
        SendAsync(() => new HttpRequestMessage(HttpMethod.Post, path) { Content = JsonContent(body) }, token);

    public Task<JsonNode?> PutAsync(string path, JsonNode body, CancellationToken token) =>
        SendAsync(() => new HttpRequestMessage(HttpMethod.Put, path) { Content = JsonContent(body) }, token);

    public void Dispose() => _http.Dispose();

    private static StringContent JsonContent(JsonNode body) =>
        new(body.ToJsonString(), Encoding.UTF8, "application/json");

    private static string QueryString((string Key, string Value)[] query) =>
        query.Length == 0
            ? ""
            : "?" + string.Join('&', query.Select(item => $"{item.Key}={Uri.EscapeDataString(item.Value)}"));

    /// <summary>
    /// Send the request until it answers with something other than a retryable status,
    /// then parse the body as JSON.
    ///
    /// A non-2xx that survives the retries throws, carrying the status and the body.
    /// Nothing here maps a failure onto an empty result: the cron flow reads an empty page
    /// as "the query is exhausted, commit the cursor", so the two have to stay distinct.
    /// </summary>
    /// <param name="newRequest">
    /// Builds the request. A <see cref="HttpRequestMessage"/> cannot be sent twice, so a
    /// client that retries needs a fresh one per attempt rather than one to hold on to.
    /// </param>
    private async Task<JsonNode?> SendAsync(Func<HttpRequestMessage> newRequest, CancellationToken token)
    {
        var wait = _backoff;
        for (var attempt = 1; attempt <= MaxAttempts; attempt++)
        {
            using var request = newRequest();
            using var response = await _http.SendAsync(request, token);

            if (RetryStatuses.Contains(response.StatusCode) && attempt < MaxAttempts)
            {
                var pause = RetryAfter(response) ?? wait;
                _logger.LogWarning(
                    "HTTP {Status} from {Uri}; retrying in {Pause} (attempt {Attempt})",
                    (int)response.StatusCode, request.RequestUri, pause, attempt);
                await Task.Delay(pause, token);
                wait *= 2;
                continue;
            }

            var body = await response.Content.ReadAsStringAsync(token);
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException(
                    $"HTTP {(int)response.StatusCode} from {request.RequestUri}: {body}");
            }

            // A 204, and some 200s, come back empty; reading that as null lets callers
            // index into the result either way.
            return string.IsNullOrWhiteSpace(body) ? null : JsonNode.Parse(body);
        }

        throw new UnreachableException("the retry loop returns or retries on every attempt");
    }

    /// <summary>
    /// How long the response asked the client to wait, or null if it did not ask — either
    /// way the doubling backoff is a safe fallback. RFC 9110 allows both a number of
    /// seconds and an HTTP date, and <see cref="HttpResponseHeaders.RetryAfter"/> has
    /// already told them apart.
    /// </summary>
    private static TimeSpan? RetryAfter(HttpResponseMessage response)
    {
        if (response.Headers.RetryAfter is not { } header)
        {
            return null;
        }

        if ((header.Delta ?? (header.Date - DateTimeOffset.UtcNow)) is not { } wait)
        {
            return null;
        }

        // A date that has already passed reads as a negative wait, which means "now".
        return TimeSpan.FromTicks(Math.Clamp(wait.Ticks, 0, MaxRetryAfter.Ticks));
    }
}
