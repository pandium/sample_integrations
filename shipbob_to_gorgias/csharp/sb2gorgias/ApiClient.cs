using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

namespace Sb2Gorgias;

/// <summary>
/// A small JSON-over-HTTP client shared by both API clients: standing headers plus a
/// bounded retry. Pandium does not retry a failed run, so a transient 429 or gateway error
/// has to be absorbed here or the whole run is lost.
/// </summary>
public sealed class ApiClient : IDisposable
{
    /// <summary>Rate limiting, plus the gateway errors both APIs return under load.</summary>
    private static readonly HashSet<HttpStatusCode> RetryStatuses =
    [
        HttpStatusCode.TooManyRequests,
        HttpStatusCode.BadGateway,
        HttpStatusCode.ServiceUnavailable,
        HttpStatusCode.GatewayTimeout,
    ];

    /// <summary>Total attempts, the first included.</summary>
    private const int MaxAttempts = 6;

    /// <summary>
    /// The longest a <c>Retry-After</c> is honoured for. A client that sleeps past Pandium's
    /// run limit never reaches the stdout write that ends the run successfully.
    /// </summary>
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
            // The trailing slash makes relative paths append to the API root rather than
            // replace its last segment.
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
    /// Send until the response is not a retryable status, then parse the body as JSON.
    ///
    /// A non-2xx that survives the retries throws, carrying the status and the body. A
    /// failure is never mapped onto an empty result: the cron flow commits its cursor on an
    /// empty page, so the two have to stay distinct.
    /// </summary>
    /// <param name="newRequest">
    /// Builds a fresh request for each attempt; an <see cref="HttpRequestMessage"/> cannot
    /// be sent twice.
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

            // A 204, and some 200s, come back empty; null lets callers index into the
            // result either way.
            return string.IsNullOrWhiteSpace(body) ? null : JsonNode.Parse(body);
        }

        throw new UnreachableException("the retry loop returns or retries on every attempt");
    }

    /// <summary>
    /// How long the response asked the client to wait, or null to fall back to the doubling
    /// backoff. Clamped so a date already passed reads as "now" and a long wait cannot
    /// outlive the run.
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

        return TimeSpan.FromTicks(Math.Clamp(wait.Ticks, 0, MaxRetryAfter.Ticks));
    }
}
