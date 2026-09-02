using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

using static Sb2Gorgias.Dates;

namespace Sb2Gorgias;

/// <summary>
/// How a Gorgias customer is identified.
///
/// A ShipBob recipient often has no email, so both flows fall back to a synthetic key built
/// from the recipient's name and address. A closed hierarchy rather than a pair of optional
/// arguments means there is always exactly one key, and the lookup and the created record
/// cannot disagree about it.
/// </summary>
public abstract record CustomerKey
{
    /// <summary>Only the two cases below: the constructor is private, so nothing else can derive.</summary>
    private CustomerKey()
    {
    }

    /// <summary>The key as Gorgias stores it on the customer's <c>external_id</c>.</summary>
    public abstract string Value { get; }

    /// <summary>The query parameter <c>GET /customers</c> looks the customer up by.</summary>
    public abstract (string Parameter, string Value) Query { get; }

    /// <summary>
    /// The recipient's email when there is one, otherwise a synthetic
    /// <c>name address1 city country</c>. Both flows key on this, so a webhook ticket lands
    /// on the record that carries the customer's order history.
    /// </summary>
    public static CustomerKey ForRecipient(Recipient? recipient) =>
        recipient?.Email is { Length: > 0 } email
            ? new Email(email)
            : new ExternalId(string.Join(' ',
                recipient?.Name ?? "",
                recipient?.Address?.Address1 ?? "",
                recipient?.Address?.City ?? "",
                recipient?.Address?.Country ?? ""));

    public sealed record Email(string Address) : CustomerKey
    {
        public override string Value => Address;

        public override (string Parameter, string Value) Query => ("email", Address.ToLowerInvariant());
    }

    public sealed record ExternalId(string Id) : CustomerKey
    {
        public override string Value => Id;

        public override (string Parameter, string Value) Query => ("external_id", Id);
    }
}

/// <summary>
/// The slice of Gorgias the two flows depend on: find-or-create a customer, write order
/// history onto them, open a ticket.
/// </summary>
public interface IHelpdesk
{
    /// <summary>
    /// The customer's detail record, or null if there is no such customer. The list
    /// endpoint omits <c>data</c>, which is where the order history lives.
    /// </summary>
    Task<JsonObject?> FindCustomerAsync(CustomerKey key, CancellationToken token);

    /// <summary>Create the customer and return their new id.</summary>
    Task<long> CreateCustomerAsync(JsonObject payload, CancellationToken token);

    Task UpdateCustomerAsync(long id, JsonObject payload, CancellationToken token);

    Task<JsonNode?> CreateTicketAsync(JsonObject payload, CancellationToken token);
}

/// <summary>
/// The real Gorgias.
///
/// Auth is OAuth2 via Pandium's <c>gorgias-oauth</c> connector: Pandium runs the
/// authorization flow and handles refreshes, so this client holds no client secret and no
/// refresh logic.
/// </summary>
public sealed class GorgiasClient : IHelpdesk, IDisposable
{
    private readonly ApiClient _api;
    private readonly ILogger<GorgiasClient> _logger;

    public GorgiasClient(Pandium pandium, ILogger<GorgiasClient> logger)
    {
        _logger = logger;
        var token = pandium.RequireSecret("gorgias_oauth_access_token");
        var account = pandium.RequireSecret("gorgias_oauth_account");

        // Every current Gorgias token is a bearer, but read the connector's scheme rather
        // than assume it.
        var scheme = pandium.Secrets.GetValueOrDefault("gorgias_oauth_token_type") is { Length: > 0 } type
            ? type
            : "Bearer";
        var baseUrl = $"https://{account.ToLowerInvariant()}.gorgias.com/api";
        logger.LogInformation("Gorgias API base URL: {BaseUrl}", baseUrl);
        _api = new ApiClient(baseUrl, new AuthenticationHeaderValue(scheme, token), TimeSpan.FromSeconds(2), logger);
    }

    public async Task<JsonObject?> FindCustomerAsync(CustomerKey key, CancellationToken token)
    {
        var (parameter, value) = key.Query;
        _logger.LogInformation("looking for gorgias customer by {Parameter} {Value}", parameter, value);

        // An email or external_id maps to at most one customer, so there is nothing to
        // paginate through.
        var found = await _api.GetAsync("customers", [(parameter, value)], token);
        if (found.Field("data").AsList().FirstOrDefault() is not { } row)
        {
            _logger.LogInformation("customer not found");
            return null;
        }

        var id = row.Field("id").AsNumber() ?? throw new InvalidOperationException("Gorgias customer has no id");
        _logger.LogInformation("customer found: {Id}", id);
        return (await _api.GetAsync($"customers/{id}", [], token)).AsMap()
            ?? throw new InvalidOperationException($"Gorgias customer {id} has no detail record");
    }

    public async Task<long> CreateCustomerAsync(JsonObject payload, CancellationToken token)
    {
        _logger.LogInformation("creating new gorgias customer");
        var created = await _api.PostAsync("customers", payload, token);
        return created.Field("id").AsNumber()
            ?? throw new InvalidOperationException("Gorgias created a customer without an id");
    }

    public async Task UpdateCustomerAsync(long id, JsonObject payload, CancellationToken token)
    {
        _logger.LogInformation("updating gorgias customer {Id}", id);
        await _api.PutAsync($"customers/{id}", payload, token);
    }

    public Task<JsonNode?> CreateTicketAsync(JsonObject payload, CancellationToken token)
    {
        _logger.LogInformation("creating gorgias ticket");
        return _api.PostAsync("tickets", payload, token);
    }

    public void Dispose() => _api.Dispose();
}

/// <summary>The Gorgias payloads both flows build.</summary>
public static class GorgiasPayloads
{
    /// <summary>ShipBob timestamps the sidebar shows as dates rather than as machine-readable text.</summary>
    private static readonly HashSet<string> DisplayDateFields =
        ["estimated_fulfillment_date", "actual_fulfillment_date"];

    /// <summary>The fields of a ShipBob order that reach the sidebar exactly as ShipBob sent them.</summary>
    private static readonly string[] PassthroughFields =
    [
        "reference_id",
        "order_number",
        "status",
        "type",
        "channel",
        "shipping_method",
        "recipient",
        "products",
        "tags",
    ];

    /// <summary>Body for <c>POST /customers</c> when the customer does not yet exist.</summary>
    public static JsonObject NewCustomerPayload(Recipient? recipient, CustomerKey key)
    {
        var payload = new JsonObject
        {
            ["name"] = recipient?.Name ?? "",
            ["external_id"] = key.Value,
            ["data"] = new JsonObject { ["pandium"] = new JsonObject { ["shipbob_orders"] = new JsonArray() } },
        };

        if (key is CustomerKey.Email email)
        {
            payload["email"] = email.Address;
        }

        return payload;
    }

    /// <summary>The single order entry stored in <c>data.pandium.shipbob_orders</c>.</summary>
    public static JsonObject OrderEntry(JsonNode? order)
    {
        var entry = new JsonObject
        {
            ["id"] = order.Field("id")?.DeepClone(),
            ["created_date"] = DisplayTimestamp(order.Field("created_date").AsText()),
            ["purchase_date"] = DisplayTimestamp(order.Field("purchase_date").AsText()),
        };

        foreach (var field in PassthroughFields)
        {
            entry[field] = order.Field(field)?.DeepClone();
        }

        entry["shipments"] = new JsonArray([.. order.Field("shipments").AsList().Select(SidebarShipment)]);
        return entry;
    }

    /// <summary>
    /// One shipment as the sidebar shows it: ShipBob's own fields, with readable dates and
    /// a deep link.
    /// </summary>
    private static JsonNode? SidebarShipment(JsonNode? shipment)
    {
        if (shipment.AsMap() is not { } fields)
        {
            return shipment?.DeepClone();
        }

        var entry = new JsonObject();
        foreach (var (key, value) in fields)
        {
            entry[key] = DisplayDateFields.Contains(key) && value.AsText() is { } timestamp
                ? DisplayTimestamp(timestamp)
                : value?.DeepClone();
        }

        var id = fields.Field("id").AsNumber()?.ToString(CultureInfo.InvariantCulture) ?? "";
        entry["url"] = $"https://web.shipbob.com/App/Merchant/#/Orders/{id}/";
        return entry;
    }
}
