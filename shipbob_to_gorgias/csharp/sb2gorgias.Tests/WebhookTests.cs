using System.Globalization;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging.Abstractions;

using static Sb2Gorgias.Tests.Payloads;

namespace Sb2Gorgias.Tests;

/// <summary>Flow B: a ticket per shipment status, deduped.</summary>
public class WebhookTests
{
    private static readonly DateTime Now = DateTime.UtcNow;

    private static string Ago(int minutes) => Now.AddMinutes(-minutes).ToString("O", CultureInfo.InvariantCulture);

    /// <summary>
    /// Run the flow over the deliveries, starting from the <c>processed_events</c> a
    /// previous run left in tenant metadata.
    /// </summary>
    private static async Task<(Dictionary<string, string> Processed, RecordingGorgias Gorgias)> RunAsync(
        IReadOnlyList<WebhookDelivery> deliveries,
        JsonNode? alreadyProcessed = null,
        params string[] knownCustomers)
    {
        var gorgias = new RecordingGorgias(knownCustomers);
        var processed = WebhookFlow.Prune(alreadyProcessed, Now);
        await new WebhookFlow(gorgias, NullLogger<WebhookFlow>.Instance)
            .ProcessAsync(deliveries, processed, Now, CancellationToken.None);
        return (processed, gorgias);
    }

    [Fact]
    public async Task ADeliveryOpensATicketAndWritesOnlyProcessedEvents()
    {
        var (processed, gorgias) = await RunAsync(
            [Delivery("t1", ShipmentEvent(456789, "Delivered"))],
            knownCustomers: "jane@example.com");

        var ticket = Assert.Single(gorgias.Tickets);

        // Linked to the customer the fake already knew about.
        Assert.Equal(40, ticket.Field("customer").Field("id").AsNumber());
        Assert.Equal(
            ["shipbob-shipment", "shipbob-delivered"],
            ticket.Field("tags").AsList().Select(tag => tag.Field("name").AsText()));

        var body = ticket.Field("messages").AsList().Single().Field("body_text").AsText() ?? "";
        Assert.Contains("is now Delivered", body);
        Assert.Contains("Tracking: USPS 9400100000000000000000", body);
        Assert.Contains("456789:Delivered", processed.Keys);
    }

    [Fact]
    public async Task ARepeatedStatusIsDroppedButTheNextStatusStillTickets()
    {
        // Dedupe is per shipment *and* status, and entries age out of the map after the
        // prune window.
        var (processed, gorgias) = await RunAsync(
            [
                Delivery("t1", ShipmentEvent(1, "OnHold")),
                Delivery("t2", ShipmentEvent(1, "OnHold")),    // a redelivery
                Delivery("t3", ShipmentEvent(1, "Delivered")), // genuinely next
            ],
            alreadyProcessed: new JsonObject
            {
                ["2:Delivered"] = Ago(0),  // recent -> kept
                ["3:Delivered"] = Ago(45), // stale -> pruned
            },
            knownCustomers: "jane@example.com");

        Assert.Equal(2, gorgias.Tickets.Count); // not three
        Assert.Equal(["1:Delivered", "1:OnHold", "2:Delivered"], processed.Keys.Order());
    }

    [Fact]
    public async Task ARecipientWithNoEmailGetsACustomerKeyedOnTheirAddress()
    {
        var (processed, gorgias) = await RunAsync([Delivery("t1", OnHoldEvent())]);

        var created = Assert.Single(gorgias.Created);
        Assert.Null(created.Field("email"));

        // The synthetic key the cron flow uses too: name address1 city country.
        Assert.Equal("Jane Buyer 100 Nowhere Blvd Gotham City US", created.Field("external_id").AsText());

        // Hung off the customer this run just created.
        var ticket = Assert.Single(gorgias.Tickets);
        Assert.Equal(1000, ticket.Field("customer").Field("id").AsNumber());

        // The body carries only what ShipBob sent for this status.
        var body = ticket.Field("messages").AsList().Single().Field("body_text").AsText() ?? "";
        Assert.Contains("is now OnHold", body);
        Assert.Contains("Reason: Invalid Address; Payment Failure", body);
        Assert.DoesNotContain("Tracking:", body); // an OnHold shipment carries none
        Assert.Contains("4 x Pinnacle Shampoo (PIN-100)", body);
        Assert.Contains("107414278:OnHold", processed.Keys);
    }
}
