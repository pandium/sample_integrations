using System.Buffers.Text;
using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

using Microsoft.Extensions.Logging;

using static Sb2Gorgias.Dates;

namespace Sb2Gorgias;

// --- the shapes this integration reads ---------------------------------------
//
// A webhook body is small and every field drives a decision, so it gets real types. An
// order is mostly passed through to the Gorgias sidebar unread, so it stays a raw JsonNode
// and only the parts the integration acts on are pulled out.
//
// The collections are nullable because a field a topic does not use may arrive as an
// explicit null (an OnHold shipment sends `"tracking": null`) or be omitted entirely.
// Callers write `?? []`.

/// <summary>Who the order or shipment is going to. Both flows key their Gorgias customer off this.</summary>
public sealed record Recipient
{
    public string? Name { get; init; }

    public string? Email { get; init; }

    public Address? Address { get; init; }
}

public sealed record Address
{
    /// <summary>Named explicitly: the snake_case policy would not put the digit in its own word.</summary>
    [JsonPropertyName("address1")]
    public string? Address1 { get; init; }

    public string? City { get; init; }

    public string? Country { get; init; }
}

/// <summary>
/// ShipBob sends a shipment on every order-related webhook topic.
///
/// <c>order_shipped</c>, <c>shipment_delivered</c>, <c>shipment_exception</c>,
/// <c>shipment_onhold</c>, and <c>shipment_cancelled</c> all deliver this same object and
/// differ only in <see cref="Status"/> and <see cref="StatusDetails"/>.
/// </summary>
public sealed record Shipment
{
    /// <summary>ShipBob names the shipment <c>id</c> on the webhook body.</summary>
    public long? Id { get; init; }

    /// <summary>Some topics send the same value as <c>shipment_id</c> instead.</summary>
    public long? ShipmentId { get; init; }

    public long? OrderId { get; init; }

    public string? ReferenceId { get; init; }

    public string? Status { get; init; }

    public IReadOnlyList<StatusDetail>? StatusDetails { get; init; }

    public Tracking? Tracking { get; init; }

    public string? DeliveryDate { get; init; }

    public IReadOnlyList<Product>? Products { get; init; }

    public Recipient? Recipient { get; init; }

    /// <summary>Whichever of the two names ShipBob used for the shipment id.</summary>
    [JsonIgnore]
    public long? ShipmentKey => Id ?? ShipmentId;

    [JsonIgnore]
    public string ReportedStatus => Status is { Length: > 0 } status ? status : "Updated";

    /// <summary>The merchant's own order reference, falling back to ShipBob's order id.</summary>
    [JsonIgnore]
    public string OrderReference =>
        ReferenceId is { Length: > 0 } reference
            ? reference
            : OrderId?.ToString(CultureInfo.InvariantCulture) ?? "";

    /// <summary>The delivery date as <c>YYYY-MM-DD</c>. Only <c>Delivered</c> shipments carry one.</summary>
    [JsonIgnore]
    public string? DeliveredOn => DeliveryDate is { Length: >= 10 } date ? date[..10] : null;
}

/// <summary>One reason ShipBob attached to a status, e.g. <c>Invalid Address</c>.</summary>
public sealed record StatusDetail(string? Name, string? Description);

public sealed record Tracking(string? Carrier, string? TrackingNumber);

public sealed record Product
{
    public string? Name { get; init; }

    public string? Sku { get; init; }

    public string? ReferenceId { get; init; }

    public IReadOnlyList<InventoryItem>? InventoryItems { get; init; }
}

public sealed record InventoryItem(long? Quantity);

// --- the client ---------------------------------------------------------------

/// <summary>The slice of ShipBob the cron flow depends on.</summary>
public interface IOrders
{
    /// <summary>
    /// One page of orders created since <paramref name="startDate"/>, oldest first. Only an
    /// exhausted query answers with an empty page; a failure throws.
    /// </summary>
    Task<IReadOnlyList<JsonNode?>> NewOrdersPageAsync(DateTime startDate, int page, CancellationToken token);

    /// <summary>One page of orders updated since <paramref name="startDate"/>, newest update first.</summary>
    Task<IReadOnlyList<JsonNode?>> UpdatedOrdersPageAsync(DateTime startDate, int page, CancellationToken token);
}

/// <summary>
/// The real ShipBob. Auth is the bearer token Pandium's <c>shipbob</c> connector supplies
/// on <c>PAN_SEC_SHIPBOB_ACCESS_TOKEN</c>. The API base URL is decoded from that token's
/// issuer claim, so the same code targets production or sandbox depending on which
/// environment the tenant connected.
/// </summary>
public sealed class ShipBobClient : IOrders, IDisposable
{
    /// <summary>ShipBob issues tokens from a different auth host per environment.</summary>
    private static readonly Dictionary<string, string> AuthUrlToBaseUrl = new()
    {
        ["https://authstage.shipbob.com"] = "https://sandbox-api.shipbob.com/2026-01",
        ["https://auth.shipbob.com"] = "https://api.shipbob.com/2026-01",
    };

    public const string DefaultBaseUrl = "https://api.shipbob.com/2026-01";

    private readonly ApiClient _api;

    public ShipBobClient(Pandium pandium, ILogger<ShipBobClient> logger)
    {
        var token = pandium.RequireSecret("shipbob_access_token");
        var baseUrl = ResolveBaseUrl(token, logger);
        logger.LogInformation("ShipBob API base URL: {BaseUrl}", baseUrl);
        _api = new ApiClient(baseUrl, new AuthenticationHeaderValue("Bearer", token), TimeSpan.FromSeconds(3), logger);
    }

    /// <summary>Decode the JWT payload and map its <c>iss</c> claim to an API base URL.</summary>
    public static string ResolveBaseUrl(string token, ILogger logger)
    {
        try
        {
            var payload = token.Split('.').ElementAtOrDefault(1) ?? "";
            var claims = JsonNode.Parse(Encoding.UTF8.GetString(Base64Url.DecodeFromChars(payload)));
            if (claims.Field("iss").AsText() is { } issuer && AuthUrlToBaseUrl.TryGetValue(issuer, out var baseUrl))
            {
                return baseUrl;
            }
        }
        catch (Exception error)
        {
            logger.LogWarning(error, "could not resolve ShipBob base URL from token");
        }

        return DefaultBaseUrl;
    }

    public Task<IReadOnlyList<JsonNode?>> NewOrdersPageAsync(DateTime startDate, int page, CancellationToken token) =>
        OrdersAsync(
            [
                ("StartDate", IsoTimestamp(startDate)),
                ("Page", page.ToString(CultureInfo.InvariantCulture)),
                ("SortOrder", "Oldest"),
            ],
            token);

    public async Task<IReadOnlyList<JsonNode?>> UpdatedOrdersPageAsync(
        DateTime startDate, int page, CancellationToken token)
    {
        var now = DateTime.UtcNow;
        var orders = await OrdersAsync(
            [("LastUpdateStartDate", IsoTimestamp(startDate)), ("Page", page.ToString(CultureInfo.InvariantCulture))],
            token);

        // Newest-first within the page, plus a cursor that only moves to the oldest update
        // seen, means a run cut short never skips an update, at the cost of re-processing
        // a few.
        return [.. orders.OrderByDescending(order => order.UpdateDate(startDate, now))];
    }

    public void Dispose() => _api.Dispose();

    /// <summary>
    /// GET one page of <c>/order</c>. The caller stops paging on an empty page and commits
    /// its cursor there, so only an exhausted query may answer with one; anything else
    /// throws, carrying the query that produced it.
    /// </summary>
    private async Task<IReadOnlyList<JsonNode?>> OrdersAsync(
        (string Key, string Value)[] query, CancellationToken token)
    {
        JsonNode? page;
        try
        {
            page = await _api.GetAsync("order", query, token);
        }
        catch (Exception error) when (!token.IsCancellationRequested)
        {
            throw new InvalidOperationException($"fetching ShipBob orders ({Describe(query)})", error);
        }

        return page switch
        {
            JsonArray orders => [.. orders],
            // A page past the end can arrive with no body, which reads as null.
            null => [],
            _ => throw new InvalidOperationException($"ShipBob answered /order ({Describe(query)}) with {page}"),
        };
    }

    private static string Describe((string Key, string Value)[] query) =>
        string.Join(", ", query.Select(item => $"{item.Key}={item.Value}"));
}

public static class ShipBobOrders
{
    /// <summary>Read the recipient off a raw ShipBob order, which is otherwise left untyped.</summary>
    public static Recipient? RecipientOf(this JsonNode? order)
    {
        try
        {
            return order.Field("recipient")?.Deserialize<Recipient>(Json.Options);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    /// <summary>
    /// The order's effective update time: the oldest shipment <c>last_update_at</c> that
    /// still falls after <paramref name="startDate"/>, or <paramref name="now"/> when none
    /// qualify. ShipBob timestamps updates on shipments rather than on the order.
    /// </summary>
    public static DateTime UpdateDate(this JsonNode? order, DateTime startDate, DateTime now) =>
        order.Field("shipments")
            .AsList()
            .Select(shipment => ParseTimestamp(shipment.Field("last_update_at").AsText()))
            .Where(updated => updated > startDate && updated < now)
            .Min() ?? now;
}
