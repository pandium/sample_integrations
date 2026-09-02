using System.Text.Json.Nodes;

namespace Sb2Gorgias.Tests;

/// <summary>
/// Serves canned pages of orders and records which pages were asked for. Each half keeps
/// its own page log, so asserting on one half's paging does not pick up the other's single
/// empty page.
/// </summary>
/// <param name="newPages">Pages the new-orders query answers with, in order.</param>
/// <param name="updatedPages">Pages the updated-orders query answers with, in order.</param>
/// <param name="failingPage">
/// A page that throws instead of answering, standing in for a ShipBob the HTTP client's
/// retries could not get a page out of.
/// </param>
public sealed class FakeShipBob(
    IReadOnlyList<IReadOnlyList<JsonNode?>>? newPages = null,
    IReadOnlyList<IReadOnlyList<JsonNode?>>? updatedPages = null,
    int? failingPage = null) : IOrders
{
    public List<int> NewPagesRequested { get; } = [];

    public List<int> UpdatedPagesRequested { get; } = [];

    /// <summary>The live cursor, when a test wants to see where it stood mid-sync.</summary>
    public Cursors? Watched { get; set; }

    /// <summary>Runs as each page is fetched — a test uses it to fire the run deadline.</summary>
    public Action<int>? OnPageFetched { get; set; }

    /// <summary>
    /// Where each cursor stood as each page was fetched, which is what a run cut short at
    /// that moment would have written back.
    /// </summary>
    public Dictionary<int, DateTime> NewCursorWhenFetched { get; } = [];

    public Dictionary<int, DateTime> UpdatedCursorWhenFetched { get; } = [];

    public Task<IReadOnlyList<JsonNode?>> NewOrdersPageAsync(DateTime startDate, int page, CancellationToken token)
    {
        NewPagesRequested.Add(page);
        if (Watched is { } cursors)
        {
            NewCursorWhenFetched[page] = cursors.NewOrders;
        }

        return PageOf(newPages, page);
    }

    public Task<IReadOnlyList<JsonNode?>> UpdatedOrdersPageAsync(DateTime startDate, int page, CancellationToken token)
    {
        UpdatedPagesRequested.Add(page);
        if (Watched is { } cursors)
        {
            UpdatedCursorWhenFetched[page] = cursors.UpdatedOrders;
        }

        return PageOf(updatedPages, page);
    }

    private Task<IReadOnlyList<JsonNode?>> PageOf(IReadOnlyList<IReadOnlyList<JsonNode?>>? pages, int page)
    {
        OnPageFetched?.Invoke(page);
        if (page == failingPage)
        {
            throw new InvalidOperationException($"ShipBob is unavailable (page {page})");
        }

        IReadOnlyList<JsonNode?> orders = pages is not null && page <= pages.Count ? pages[page - 1] : [];
        return Task.FromResult(orders);
    }
}

/// <summary>
/// An <see cref="IHelpdesk"/> that keeps every call in memory. <paramref name="known"/>
/// names customers that already exist; they are found at ids 40, 41, and so on.
/// </summary>
public sealed class RecordingGorgias(params string[] known) : IHelpdesk
{
    private readonly Dictionary<string, long> _customers =
        known.Select((key, offset) => (key, id: 40L + offset)).ToDictionary(item => item.key, item => item.id);

    public List<JsonObject> Created { get; } = [];

    public List<(long Id, JsonObject Payload)> Updated { get; } = [];

    public List<JsonObject> Tickets { get; } = [];

    public Task<JsonObject?> FindCustomerAsync(CustomerKey key, CancellationToken token) =>
        Task.FromResult(_customers.TryGetValue(key.Value, out var id)
            ? new JsonObject
            {
                ["id"] = id,
                ["data"] = new JsonObject { ["pandium"] = new JsonObject { ["shipbob_orders"] = new JsonArray() } },
            }
            : null);

    public Task<long> CreateCustomerAsync(JsonObject payload, CancellationToken token)
    {
        var id = 1000L + Created.Count;
        if (payload.Field("external_id").AsText() is { } key)
        {
            _customers[key] = id;
        }

        Created.Add(payload);
        return Task.FromResult(id);
    }

    public Task UpdateCustomerAsync(long id, JsonObject payload, CancellationToken token)
    {
        Updated.Add((id, payload));
        return Task.CompletedTask;
    }

    public Task<JsonNode?> CreateTicketAsync(JsonObject payload, CancellationToken token)
    {
        Tickets.Add(payload);
        return Task.FromResult<JsonNode?>(new JsonObject { ["id"] = 900L + Tickets.Count });
    }
}

/// <summary>
/// The payload factories the tests build their fixtures from. Nothing here touches the
/// network, the filesystem, or the environment.
/// </summary>
public static class Payloads
{
    /// <summary>A ShipBob order as the cron flow sees it.</summary>
    public static JsonObject Order(long id, string created, string? email) => new()
    {
        ["id"] = id,
        ["created_date"] = created,
        ["reference_id"] = $"REF-{id}",
        ["recipient"] = new JsonObject
        {
            ["name"] = "Buyer",
            ["email"] = email,
            ["address"] = new JsonObject
            {
                ["address1"] = "1 Main St",
                ["city"] = "NY",
                ["country"] = "US",
            },
        },
        ["shipments"] = new JsonArray(new JsonObject { ["id"] = id * 10, ["last_update_at"] = created }),
    };

    /// <summary>
    /// The same order, with its shipment updated at a different time than it was created —
    /// which is what the updated-orders cursor keys off.
    /// </summary>
    public static JsonObject OrderUpdatedOn(long id, string updated, string email)
    {
        var order = Order(id, "2026-07-01T00:00:00Z", email);
        order["shipments"] = new JsonArray(new JsonObject { ["id"] = id * 10, ["last_update_at"] = updated });
        return order;
    }

    /// <summary>
    /// A ShipBob shipment webhook body. Every order-related topic delivers this same
    /// object; <c>status</c> and <c>status_details</c> are what vary between them.
    /// </summary>
    public static JsonObject ShipmentEvent(long shipmentId, string status) => new()
    {
        ["id"] = shipmentId,
        ["order_id"] = 289012345L,
        ["reference_id"] = "MERCHANT-ORDER-1001",
        ["status"] = status,
        ["status_details"] = new JsonArray(),
        ["tracking"] = new JsonObject
        {
            ["carrier"] = "USPS",
            ["tracking_number"] = "9400100000000000000000",
        },
        ["delivery_date"] = "2026-07-09T18:22:00Z",
        ["products"] = new JsonArray(
            new JsonObject
            {
                ["name"] = "Pinnacle Shampoo",
                ["sku"] = "PIN-100",
                ["inventory_items"] = new JsonArray(
                    new JsonObject { ["name"] = "Pinnacle Shampoo", ["quantity"] = 4 }),
            }),
        ["recipient"] = new JsonObject
        {
            ["name"] = "Jane Buyer",
            ["email"] = "jane@example.com",
            ["address"] = new JsonObject
            {
                ["address1"] = "100 Nowhere Blvd",
                ["city"] = "Gotham City",
                ["country"] = "US",
            },
        },
    };

    /// <summary>
    /// The harder shape: status details, no tracking, and no recipient email — the one that
    /// exercises the synthetic <c>external_id</c> customer path.
    /// </summary>
    public static JsonObject OnHoldEvent()
    {
        var shipment = ShipmentEvent(107414278L, "OnHold");
        shipment["status_details"] = new JsonArray(
            new JsonObject { ["id"] = 401, ["name"] = "InvalidAddress", ["description"] = "Invalid Address" },
            new JsonObject { ["id"] = 400, ["name"] = "PaymentDeclined", ["description"] = "Payment Failure" });
        shipment["tracking"] = null;
        shipment["delivery_date"] = null;
        shipment["recipient"] = new JsonObject
        {
            ["name"] = "Jane Buyer",
            ["email"] = null,
            ["address"] = new JsonObject
            {
                ["address1"] = "100 Nowhere Blvd",
                ["city"] = "Gotham City",
                ["country"] = "US",
            },
        };
        return shipment;
    }

    /// <summary>
    /// An event wrapped the way Pandium hands one to a run. The real thing arrives as a
    /// file path, which <see cref="Pandium.WebhookDeliveries"/> has already read back.
    /// </summary>
    public static WebhookDelivery Delivery(string id, JsonObject shipment) =>
        new(id, shipment.ToJsonString());
}
