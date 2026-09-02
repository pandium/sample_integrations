using System.Text.Json.Nodes;

using DotNetEnv;

using Microsoft.Extensions.Logging;

namespace Sb2Gorgias;

/// <summary>
/// Both flows ship in one assembly and are selected by Pandium's run mode.
///
/// <c>Pandium.cs</c> is the file to read first: it holds the whole platform contract —
/// config and secrets, the run context, and the single stdout write that hands metadata
/// back.
/// </summary>
internal static class Program
{
    /// <summary>
    /// A self-imposed deadline a minute inside Pandium's ten-minute run limit, leaving room
    /// to write the cursor. The cron flow treats the cancellation as "stop here and flush";
    /// a webhook run is a handful of API calls, and if one somehow runs this long, failing
    /// is what Pandium's own limit would have done anyway.
    /// </summary>
    private static readonly TimeSpan Deadline = TimeSpan.FromMinutes(9);

    private static async Task<int> Main()
    {
        // Pandium sets secrets, configs, and context as environment variables; a local .env
        // file stands in for them during development. Real environment variables win over
        // anything a stray .env sets.
        Env.Load(options: new LoadOptions(clobberExistingVars: false));

        // Logs go to stderr; stdout carries the JSON metadata Pandium reads back. Set
        // LOG_LEVEL (e.g. to Debug) to change verbosity without rebuilding.
        using var loggerFactory = LoggerFactory.Create(builder => builder
            .SetMinimumLevel(MinimumLevel())
            .AddConsole(options => options.LogToStandardErrorThreshold = LogLevel.Trace)
            .AddSimpleConsole(options =>
            {
                options.SingleLine = true;
                options.TimestampFormat = "yyyy-MM-dd HH:mm:ss.fff ";
            }));
        var logger = loggerFactory.CreateLogger(typeof(Program));

        var pandium = Pandium.FromEnv(loggerFactory);
        var mode = pandium.RunMode ?? "normal";
        logger.LogInformation("syncing ShipBob to Gorgias; this run is in mode: {RunMode}", mode);

        using var deadline = new CancellationTokenSource(Deadline);
        try
        {
            JsonObject metadata = mode switch
            {
                // A Gorgias ticket per new shipment status.
                "webhook" => await WebhookFlow.RunAsync(pandium, loggerFactory, deadline.Token),

                // The scheduled ShipBob orders to Gorgias customer sync.
                _ => await CronFlow.RunAsync(pandium, loggerFactory, deadline.Token),
            };

            pandium.UpdateMetadata(metadata);
            return 0;
        }
        catch (Exception error)
        {
            // Exit non-zero with nothing on stdout, leaving the tenant's stored metadata as
            // the last successful run left it.
            logger.LogError(error, "the run failed; leaving tenant metadata untouched");
            return 1;
        }
    }

    private static LogLevel MinimumLevel() =>
        Enum.TryParse<LogLevel>(Environment.GetEnvironmentVariable("LOG_LEVEL"), ignoreCase: true, out var level)
            ? level
            : LogLevel.Information;
}
