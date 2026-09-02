using System.Runtime.CompilerServices;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

using static Sb2Gorgias.Dates;
using static Sb2Gorgias.GorgiasPayloads;

namespace Sb2Gorgias;

/// <summary>
/// The point each of the two order queries resumes from. <see cref="NewOrders"/> is fetched
/// oldest-first, so it advances per order; <see cref="UpdatedOrders"/> is the minimum update
/// across the whole result set, so it is only known once the last page is read.
///
/// Either way it tracks orders <em>attempted</em>, not orders Gorgias accepted: a write
/// failure is logged and the sync moves on.
/// </summary>
public sealed class Cursors(DateTime newOrders, DateTime updatedOrders)
{
    public DateTime NewOrders { get; set; } = newOrders;

    public DateTime UpdatedOrders { get; set; } = updatedOrders;

    /// <summary>
    /// The cursor as Pandium stores it. Only these two keys are written, so the shallow
    /// merge leaves the webhook flow's <c>processed_events</c> untouched.
    /// </summary>
    public JsonObject ToMetadata() => new()
    {
        ["new_order_start_date"] = IsoTimestamp(NewOrders),
        ["updated_order_start_date"] = IsoTimestamp(UpdatedOrders),
    };
}

/// <summary>
/// The cron flow: ShipBob orders to the Gorgias customer sidebar.
///
/// Keeps each Gorgias customer's <c>data.pandium.shipbob_orders</c> in sync with that
/// customer's recent ShipBob orders, resuming from a cursor stored in tenant metadata.
///
/// Pandium bounds a run at roughly ten minutes, so a large backlog will not finish in one
/// pass. To stay resumable, the sync keeps a single <see cref="Cursors"/> current as each
/// order is processed and stops on the cancellation token the caller sets a deadline on;
/// whatever the cursor had reached is what the run writes back.
/// </summary>
public sealed class CronFlow(IOrders shipbob, IHelpdesk gorgias, ILogger<CronFlow> logger)
{
    /// <summary>How far back the very first sync may reach, and the floor every later cursor is held to.</summary>
    private const int MaxLookbackDays = 30;

    /// <summary>How many of a customer's most recent orders the sidebar keeps.</summary>
    private const int MaxOrdersToSync = 10;

    /// <summary>
    /// Read the cursor out of tenant metadata, run the sync, and hand back the cursor to
    /// store — whether the sync ran to the end or the deadline cut it short.
    /// </summary>
    public static async Task<JsonObject> RunAsync(
        Pandium pandium, ILoggerFactory loggerFactory, CancellationToken token)
    {
        var now = DateTime.UtcNow;
        var metadata = pandium.Metadata;

        // The end user supplies the start date from the connection settings form until the
        // first run has written a cursor of its own.
        var configured = pandium.Config.GetValueOrDefault("order_start_date");
        DateTime CursorFor(string key) =>
            Clamp(metadata.Field(key).AsText() is { Length: > 0 } stored ? stored : configured, now);

        var cursors = new Cursors(CursorFor("new_order_start_date"), CursorFor("updated_order_start_date"));

        using var orders = new ShipBobClient(pandium, loggerFactory.CreateLogger<ShipBobClient>());
        using var helpdesk = new GorgiasClient(pandium, loggerFactory.CreateLogger<GorgiasClient>());
        var flow = new CronFlow(orders, helpdesk, loggerFactory.CreateLogger<CronFlow>());
        await flow.SyncAsync(cursors, pandium.Flag("newest_order_first"), now, token);

        return cursors.ToMetadata();
    }

    /// <summary>
    /// Hold a cursor inside <c>[now - 30 days, now]</c>. A missing or unparseable value — a
    /// first run, mostly — starts at the floor.
    /// </summary>
    public static DateTime Clamp(string? value, DateTime now)
    {
        var floor = now.AddDays(-MaxLookbackDays);
        if (ParseTimestamp(value) is not { } parsed)
        {
            return floor;
        }

        return parsed < floor ? floor : parsed > now ? now : parsed;
    }

    /// <summary>
    /// Run both halves of the sync, advancing <paramref name="cursors"/> as each order is
    /// processed. A failed fetch throws, ending the run without writing metadata;
    /// re-syncing on the next run is harmless, since the customer write is an idempotent
    /// PUT.
    ///
    /// Takes the <see cref="IOrders"/> and <see cref="IHelpdesk"/> interfaces rather than
    /// building them, so the tests drive this half with in-memory doubles.
    /// </summary>
    public async Task SyncAsync(Cursors cursors, bool newestFirst, DateTime now, CancellationToken token)
    {
        // Orders for each customer batch onto a single record.
        var customers = new Dictionary<string, CustomerRecord>();

        try
        {
            await SyncNewOrdersAsync(cursors, customers, newestFirst, token);
            await SyncUpdatedOrdersAsync(cursors, customers, newestFirst, now, token);
        }
        catch (OperationCanceledException)
        {
            // The deadline the caller set, a minute inside Pandium's run limit. Returning
            // normally is the point: the run ends successfully, Pandium merges the cursor
            // as it stands, and the next run picks up from there.
            logger.LogWarning("approaching the run-time limit — flushing the cursor for the next run");
        }
    }

    /// <summary>
    /// New orders come back oldest-first, so the last order processed is the right place to
    /// resume from.
    /// </summary>
    private async Task SyncNewOrdersAsync(
        Cursors cursors,
        Dictionary<string, CustomerRecord> customers,
        bool newestFirst,
        CancellationToken token)
    {
        var start = cursors.NewOrders;
        logger.LogInformation("syncing new ShipBob orders since {Start}", IsoTimestamp(start));

        var pages = OrdersUntilExhaustedAsync(page => shipbob.NewOrdersPageAsync(start, page, token), token);
        await foreach (var order in pages)
        {
            logger.LogInformation("processing new order with id {Id}", order.Field("id"));
            await ProcessOrderAsync(order, customers, newestFirst, token);
            if (ParseTimestamp(order.Field("created_date").AsText()) is { } created)
            {
                cursors.NewOrders = created;
            }
        }
    }

    /// <summary>
    /// Updated orders are sorted newest-first within a page but not across pages, so the
    /// cursor is the <em>minimum</em> over every order processed. It is kept off
    /// <paramref name="cursors"/> until the loop ends: a partial minimum would sit newer
    /// than the pages still unread.
    /// </summary>
    private async Task SyncUpdatedOrdersAsync(
        Cursors cursors,
        Dictionary<string, CustomerRecord> customers,
        bool newestFirst,
        DateTime now,
        CancellationToken token)
    {
        var start = cursors.UpdatedOrders;
        logger.LogInformation("syncing updated ShipBob orders since {Start}", IsoTimestamp(start));

        DateTime? oldestUpdate = null;
        var pages = OrdersUntilExhaustedAsync(page => shipbob.UpdatedOrdersPageAsync(start, page, token), token);
        await foreach (var order in pages)
        {
            logger.LogInformation("processing updated order with id {Id}", order.Field("id"));
            await ProcessOrderAsync(order, customers, newestFirst, token);

            var updated = order.UpdateDate(start, now);
            oldestUpdate = oldestUpdate is { } oldest && oldest < updated ? oldest : updated;
        }

        // Every page is in, so the minimum is final and safe to resume from.
        if (oldestUpdate is { } resume)
        {
            cursors.UpdatedOrders = resume;
        }
    }

    /// <summary>
    /// The orders of a paginated ShipBob query, until it answers with an empty page. An
    /// async iterator, so a page is fetched only once the previous one has been processed
    /// and the cursor has moved with it.
    /// </summary>
    private static async IAsyncEnumerable<JsonNode?> OrdersUntilExhaustedAsync(
        Func<int, Task<IReadOnlyList<JsonNode?>>> fetchPage,
        [EnumeratorCancellation] CancellationToken token)
    {
        for (var page = 1; ; page++)
        {
            var orders = await fetchPage(page);
            if (orders.Count == 0)
            {
                yield break;
            }

            foreach (var order in orders)
            {
                token.ThrowIfCancellationRequested();
                yield return order;
            }
        }
    }

    /// <summary>
    /// Find-or-create the order's Gorgias customer, then write their updated
    /// <c>data.pandium.shipbob_orders</c> back. Failures are logged and swallowed so the
    /// sync keeps going; see <see cref="Cursors"/> for what that means for the cursor.
    /// </summary>
    private async Task ProcessOrderAsync(
        JsonNode? order,
        Dictionary<string, CustomerRecord> customers,
        bool newestFirst,
        CancellationToken token)
    {
        var recipient = order.RecipientOf();
        var key = CustomerKey.ForRecipient(recipient);

        if (!customers.TryGetValue(key.Value, out var customer))
        {
            try
            {
                customer = await LookUpAsync(recipient, key, token);
            }
            catch (Exception error) when (error is not OperationCanceledException)
            {
                logger.LogError(
                    error, "skipping order {Id} — cannot fetch customer {Key}", order.Field("id"), key.Value);
                return;
            }

            customers[key.Value] = customer;
        }

        customer.AddOrder(OrderEntry(order), newestFirst);

        try
        {
            if (customer.Id is { } id)
            {
                await gorgias.UpdateCustomerAsync(id, customer.Payload(), token);
            }
            else
            {
                // Remember the new id so the next order for this customer updates the
                // record instead of creating a second one.
                customer.Id = await gorgias.CreateCustomerAsync(customer.Payload(), token);
            }
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            logger.LogError(error, "failed to upsert Gorgias customer {Key}", key.Value);
        }
    }

    /// <summary>The customer Gorgias already holds under the key, or the payload to create them with.</summary>
    private async Task<CustomerRecord> LookUpAsync(Recipient? recipient, CustomerKey key, CancellationToken token) =>
        await gorgias.FindCustomerAsync(key, token) is { } found
            ? new CustomerRecord(
                new JsonObject { ["data"] = found.Field("data")?.DeepClone() },
                found.Field("id").AsNumber())
            : new CustomerRecord(NewCustomerPayload(recipient, key), id: null);

    /// <summary>One customer key's record: what Gorgias already held, plus the orders this run added.</summary>
    private sealed class CustomerRecord
    {
        /// <summary><c>{"data": ...}</c> for a customer this run found, or the create payload for a new one.</summary>
        private readonly JsonObject _stored;

        private List<JsonNode?> _orders;

        public CustomerRecord(JsonObject stored, long? id)
        {
            _stored = stored;
            Id = id;
            _orders = [.. stored.Field("data").Field("pandium").Field("shipbob_orders").AsList()];
        }

        /// <summary>Null until the customer exists in Gorgias; the create call fills it in.</summary>
        public long? Id { get; set; }

        /// <summary>
        /// Merge the entry into the order list — replacing the order with the same id, or
        /// adding it and trimming the list back to the most recent
        /// <see cref="MaxOrdersToSync"/>.
        /// </summary>
        public void AddOrder(JsonObject entry, bool newestFirst)
        {
            var id = entry.Field("id").AsNumber();
            var existing = _orders.FindIndex(order => order.Field("id").AsNumber() == id);
            if (existing >= 0)
            {
                _orders[existing] = entry; // replaced in place: order and length are unchanged
                return;
            }

            _orders.Add(entry);
            _orders = [.. _orders.OrderBy(order => order.Field("id").AsNumber() ?? 0)];
            if (newestFirst)
            {
                _orders.Reverse();
            }

            if (_orders.Count > MaxOrdersToSync)
            {
                // The list is sorted, so the orders to drop are always at the far end.
                _orders = newestFirst
                    ? [.. _orders.Take(MaxOrdersToSync)]
                    : [.. _orders.TakeLast(MaxOrdersToSync)];
            }
        }

        /// <summary>
        /// The record as Gorgias receives it, rebuilt so that <c>data</c> keys this
        /// integration does not own stay exactly where they were.
        /// </summary>
        public JsonObject Payload()
        {
            var pandium = new JsonObject();
            foreach (var (key, value) in _stored.Field("data").Field("pandium").AsMap() ?? [])
            {
                if (key != "shipbob_orders")
                {
                    pandium[key] = value?.DeepClone();
                }
            }

            pandium["shipbob_orders"] = new JsonArray([.. _orders.Select(order => order?.DeepClone())]);

            var data = new JsonObject();
            foreach (var (key, value) in _stored.Field("data").AsMap() ?? [])
            {
                if (key != "pandium")
                {
                    data[key] = value?.DeepClone();
                }
            }

            data["pandium"] = pandium;

            var payload = new JsonObject();
            foreach (var (key, value) in _stored)
            {
                if (key != "data")
                {
                    payload[key] = value?.DeepClone();
                }
            }

            if (Id is { } id)
            {
                payload["id"] = id;
            }

            payload["data"] = data;
            return payload;
        }
    }
}
