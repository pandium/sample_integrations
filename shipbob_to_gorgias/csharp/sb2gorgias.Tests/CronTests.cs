using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging.Abstractions;

using static Sb2Gorgias.Dates;
using static Sb2Gorgias.Tests.Payloads;

namespace Sb2Gorgias.Tests;

/// <summary>Flow A: the resumable order sync.</summary>
public class CronTests
{
    /// <summary>Comfortably later than every timestamp in the fixtures.</summary>
    private static readonly DateTime Now = At("2026-07-20T00:00:00");

    private static DateTime At(string value) =>
        ParseTimestamp(value) ?? throw new ArgumentException($"not a test timestamp: {value}", nameof(value));

    private static Cursors CursorsFrom(string start) => new(At(start), At(start));

    private static CronFlow Flow(IOrders shipbob, IHelpdesk gorgias) =>
        new(shipbob, gorgias, NullLogger<CronFlow>.Instance);

    private static string? Cursor(Cursors cursors, string key) => cursors.ToMetadata()[key].AsText();

    private static JsonObject UpdatedOn(long id, int day) =>
        OrderUpdatedOn(id, $"2026-07-{day:D2}T00:00:00Z", "j@x.com");

    [Fact]
    public async Task TheSyncPagesUntilEmptyAndKeepsTheCursorCurrentAsItGoes()
    {
        // Advancing the cursor per order rather than once at the end is what makes the flow
        // resumable.
        var shipbob = new FakeShipBob(newPages:
        [
            [Order(1, "2026-07-05T10:00:00Z", "j@x.com")],
            [Order(2, "2026-07-06T10:00:00Z", "j@x.com")],
        ]);
        var gorgias = new RecordingGorgias();
        var cursors = CursorsFrom("2026-07-01");
        shipbob.Watched = cursors;

        await Flow(shipbob, gorgias).SyncAsync(cursors, newestFirst: false, Now, CancellationToken.None);

        Assert.Equal([1, 2, 3], shipbob.NewPagesRequested); // until empty

        // What a run cut short would have written when page 2 was fetched: order 1 done.
        Assert.Equal("2026-07-05T10:00:00", IsoTimestamp(shipbob.NewCursorWhenFetched[2]));
        Assert.Equal("2026-07-06T10:00:00", Cursor(cursors, "new_order_start_date"));

        // Both orders batch onto one customer: created once, then updated.
        Assert.Single(gorgias.Created);
        var (_, customer) = gorgias.Updated[^1];
        Assert.Equal(2, customer.Field("data").Field("pandium").Field("shipbob_orders").AsList().Count);
    }

    [Fact]
    public async Task TheUpdatedCursorLandsOnTheOldestUpdateAcrossEveryPage()
    {
        // Pages are each sorted newest-first, but not relative to each other, so the cursor
        // has to be the oldest update seen anywhere.
        var shipbob = new FakeShipBob(updatedPages:
        [
            [UpdatedOn(1, 18), UpdatedOn(2, 17)],
            [UpdatedOn(3, 11), UpdatedOn(4, 12)], // the oldest update overall
            [UpdatedOn(5, 16)],                   // newer again, after the oldest page
        ]);
        var cursors = CursorsFrom("2026-07-01");
        shipbob.Watched = cursors;

        await Flow(shipbob, new RecordingGorgias()).SyncAsync(cursors, newestFirst: false, Now, CancellationToken.None);

        // Not order 5, the last one processed.
        Assert.Equal("2026-07-11T00:00:00", Cursor(cursors, "updated_order_start_date"));

        // Until the last page is in the minimum is provisional, so a run cut short partway
        // through writes the value it started with.
        foreach (var page in (int[])[1, 2, 3])
        {
            Assert.Equal(
                "2026-07-01T00:00:00",
                IsoTimestamp(shipbob.UpdatedCursorWhenFetched[page]));
        }
    }

    [Fact]
    public async Task APageThatFailsToFetchEndsTheRunRatherThanCommittingACursor()
    {
        // A page that errors has to stay distinguishable from the empty page that ends the
        // loop, or the run would stop early and commit a cursor for pages it never read.
        var shipbob = new FakeShipBob(
            updatedPages:
            [
                [UpdatedOn(1, 18)],
                [UpdatedOn(2, 11)], // never read: the fetch fails first
            ],
            failingPage: 2);
        var cursors = CursorsFrom("2026-07-01");

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            Flow(shipbob, new RecordingGorgias()).SyncAsync(cursors, newestFirst: false, Now, CancellationToken.None));

        // Stopped at the failure rather than paging on.
        Assert.Equal([1, 2], shipbob.UpdatedPagesRequested);
        Assert.Equal("2026-07-01T00:00:00", Cursor(cursors, "updated_order_start_date"));
    }

    [Fact]
    public async Task TheRunDeadlineEndsTheSyncWithTheCursorItHadReached()
    {
        // The deadline Program.cs sets a minute inside Pandium's run limit. Cancelling is
        // not a failure: the sync returns, the run exits 0, and Pandium merges the partial
        // cursor for the next run to resume from.
        using var deadline = new CancellationTokenSource();
        var shipbob = new FakeShipBob(newPages:
        [
            [Order(1, "2026-07-05T10:00:00Z", "j@x.com")],
            [Order(2, "2026-07-06T10:00:00Z", "j@x.com")],
        ]);
        shipbob.OnPageFetched = page =>
        {
            if (page == 2)
            {
                deadline.Cancel();
            }
        };
        var cursors = CursorsFrom("2026-07-01");

        await Flow(shipbob, new RecordingGorgias()).SyncAsync(cursors, newestFirst: false, Now, deadline.Token);

        // Order 1 was processed; order 2 was fetched but never reached.
        Assert.Equal("2026-07-05T10:00:00", Cursor(cursors, "new_order_start_date"));
        Assert.Equal([1, 2], shipbob.NewPagesRequested);
        Assert.Empty(shipbob.UpdatedPagesRequested);
    }
}
