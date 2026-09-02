using System.Globalization;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

using static Sb2Gorgias.Dates;
using static Sb2Gorgias.GorgiasPayloads;

namespace Sb2Gorgias;

/// <summary>
/// The webhook flow: any ShipBob order webhook to a Gorgias ticket.
///
/// A run may carry N debounced deliveries, so the flow loops over every one. Creating a
/// ticket is not idempotent and ShipBob retries any delivery that does not get a 2xx, so
/// deliveries are deduped on <c>shipment_id:status</c> in a <c>processed_events</c> map in
/// tenant metadata, pruned to a 30-minute window. Keying on the status as well as the
/// shipment lets a redelivery be dropped while the shipment's genuine <em>next</em> status
/// still opens a ticket.
///
/// Pandium verifies each delivery's signature before it reaches a run, so the bodies
/// handled here are already known to have come from ShipBob.
/// </summary>
public sealed class WebhookFlow(IHelpdesk gorgias, ILogger<WebhookFlow> logger)
{
    /// <summary>How long a handled event is remembered: past ShipBob's retries, short enough to stay small.</summary>
    private const int PruneWindowMinutes = 30;

    /// <summary>Goes on every ticket this flow opens, so they can all be found at once.</summary>
    private const string ShipmentTag = "shipbob-shipment";

    public static async Task<JsonObject> RunAsync(
        Pandium pandium, ILoggerFactory loggerFactory, CancellationToken token)
    {
        var now = DateTime.UtcNow;
        var processed = Prune(pandium.Metadata.Field("processed_events"), now);

        using var helpdesk = new GorgiasClient(pandium, loggerFactory.CreateLogger<GorgiasClient>());
        var flow = new WebhookFlow(helpdesk, loggerFactory.CreateLogger<WebhookFlow>());
        await flow.ProcessAsync(pandium.WebhookDeliveries(), processed, now, token);

        return new JsonObject
        {
            ["processed_events"] = new JsonObject(
                processed.Select(entry => KeyValuePair.Create(entry.Key, (JsonNode?)JsonValue.Create(entry.Value)))),
        };
    }

    /// <summary>Drop entries older than <see cref="PruneWindowMinutes"/>, or too mangled to date.</summary>
    public static Dictionary<string, string> Prune(JsonNode? processed, DateTime now)
    {
        var cutoff = now.AddMinutes(-PruneWindowMinutes);

        // No metadata yet means nothing has been ticketed.
        return (processed.AsMap() ?? [])
            .Where(entry => ParseTimestamp(entry.Value.AsText()) >= cutoff)
            .ToDictionary(entry => entry.Key, entry => entry.Value.AsText()!);
    }

    /// <summary>
    /// Open a ticket for every delivery that has not been ticketed already, marking each
    /// one handled in <paramref name="processed"/> as it goes.
    ///
    /// Takes the <see cref="IHelpdesk"/> interface rather than building one, so the tests
    /// drive this half with in-memory doubles.
    /// </summary>
    public async Task ProcessAsync(
        IReadOnlyList<WebhookDelivery> deliveries,
        Dictionary<string, string> processed,
        DateTime now,
        CancellationToken token)
    {
        var ticketedAt = now.ToString("O", CultureInfo.InvariantCulture);
        var opened = 0;

        foreach (var delivery in deliveries)
        {
            if (Read(delivery) is not { } shipment)
            {
                continue;
            }

            if (shipment.ShipmentKey is not { } shipmentId)
            {
                logger.LogWarning("webhook delivery {Id} has no shipment id", delivery.Id);
                continue;
            }

            // Every order webhook gets a ticket, whatever the status: the status is part of
            // the dedupe key, never a filter.
            var status = shipment.ReportedStatus;
            var eventKey = $"{shipmentId}:{status}";
            if (processed.ContainsKey(eventKey))
            {
                logger.LogInformation("shipment {Id} is already ticketed as {Status}; skipping", shipmentId, status);
                continue;
            }

            long customerId;
            try
            {
                customerId = await ResolveCustomerAsync(shipment, token);
            }
            catch (Exception error) when (error is not OperationCanceledException)
            {
                // Left unprocessed on purpose, so ShipBob's retry gets another go.
                logger.LogError(error, "no Gorgias customer for shipment {Id}", shipmentId);
                continue;
            }

            try
            {
                var ticket = await gorgias.CreateTicketAsync(BuildTicket(shipment, customerId), token);
                logger.LogInformation(
                    "opened Gorgias ticket {Ticket} for shipment {Id} ({Status})",
                    ticket.Field("id"), shipmentId, status);
                processed[eventKey] = ticketedAt;
                opened++;
            }
            catch (Exception error) when (error is not OperationCanceledException)
            {
                logger.LogError(error, "failed to open a ticket for {Id}", shipmentId);
            }
        }

        logger.LogInformation(
            "webhook flow: opened {Opened} ticket(s); tracking {Tracked} event(s)", opened, processed.Count);
    }

    /// <summary>
    /// The <c>POST /tickets</c> payload for a shipment webhook of any status.
    ///
    /// Only the parts ShipBob actually sent for this status make it into the body — an
    /// OnHold shipment has no tracking, a Delivered one has no status details — which is
    /// why <see cref="Shipment"/> models those fields as nullable and this walks them one
    /// at a time.
    /// </summary>
    public static JsonObject BuildTicket(Shipment shipment, long customerId)
    {
        var reference = shipment.OrderReference;
        var status = shipment.ReportedStatus;
        var headline = $"Shipment {shipment.ShipmentKey ?? 0} for order {reference} is now {status}.";

        var text = new List<string> { headline };
        var html = new List<string> { $"<p>{headline}</p>" };

        var reasons = string.Join("; ",
            (shipment.StatusDetails ?? []).Select(detail => detail.Description ?? detail.Name).OfType<string>());
        if (reasons.Length > 0)
        {
            text.Add($"Reason: {reasons}");
            html.Add($"<p><b>Reason:</b> {reasons}</p>");
        }

        if (shipment.Tracking is { } tracking)
        {
            var summary = $"{tracking.Carrier} {tracking.TrackingNumber}".Trim();
            if (summary.Length > 0)
            {
                text.Add($"Tracking: {summary}");
                html.Add($"<p><b>Tracking:</b> {summary}</p>");
            }
        }

        if (shipment.DeliveredOn is { } delivered)
        {
            text.Add($"Delivered on: {delivered}");
        }

        var items = (shipment.Products ?? []).Select(ItemLine).ToList();
        if (items.Count > 0)
        {
            text.Add("Items:\n" + string.Join('\n', items));
            html.Add("<ul>" + string.Join("", items.Select(item => $"<li>{item}</li>")) + "</ul>");
        }

        // Gorgias wants the customer twice: as the ticket's owner and as the sender of its
        // first message. Two objects rather than one shared one, because a JsonNode belongs
        // to a single parent.
        JsonObject Customer() => new() { ["id"] = customerId };

        return new JsonObject
        {
            ["customer"] = Customer(),
            ["channel"] = "api",
            ["via"] = "api",
            ["from_agent"] = false,
            ["status"] = "open",
            ["messages"] = new JsonArray(
                new JsonObject
                {
                    ["sender"] = Customer(),
                    ["channel"] = "api",
                    ["via"] = "api",
                    ["from_agent"] = false,
                    ["subject"] = $"Order {reference}: shipment {status}",
                    ["body_text"] = string.Join('\n', text),
                    ["body_html"] = string.Join("", html),
                    // Included so Gorgias auto-reply and keyword rules can fire.
                    ["stripped_text"] = headline,
                }),
            // A constant tag plus the status, so Gorgias rules can route without parsing
            // the body.
            ["tags"] = new JsonArray(
                new JsonObject { ["name"] = ShipmentTag },
                new JsonObject { ["name"] = $"shipbob-{status.ToLowerInvariant().Replace(' ', '-')}" }),
        };
    }

    /// <summary>One line per product on the shipment: <c>4 x 16 oz. Shampoo (PIN-100)</c>.</summary>
    private static string ItemLine(Product product)
    {
        var quantity = (product.InventoryItems ?? []).Sum(item => item.Quantity ?? 0);
        var sku = product.Sku is { Length: > 0 } code ? code : product.ReferenceId;
        return sku is { Length: > 0 }
            ? $"{quantity} x {product.Name} ({sku})"
            : $"{quantity} x {product.Name}";
    }

    /// <summary>The delivery's body as a shipment, or null if it is not one.</summary>
    private Shipment? Read(WebhookDelivery delivery)
    {
        try
        {
            return Json.Deserialize<Shipment>(delivery.Body);
        }
        catch (Exception error)
        {
            logger.LogError(error, "webhook delivery {Id} is not a shipment", delivery.Id);
            return null;
        }
    }

    /// <summary>
    /// Find-or-create the Gorgias customer for a shipment's recipient. Uses the same key
    /// the cron flow does, so the ticket lands on the record carrying the customer's order
    /// history.
    /// </summary>
    private async Task<long> ResolveCustomerAsync(Shipment shipment, CancellationToken token)
    {
        var key = CustomerKey.ForRecipient(shipment.Recipient);
        return await gorgias.FindCustomerAsync(key, token) is { } found
            ? found.Field("id").AsNumber() ?? throw new InvalidOperationException("customer has no id")
            : await gorgias.CreateCustomerAsync(NewCustomerPayload(shipment.Recipient, key), token);
    }
}
