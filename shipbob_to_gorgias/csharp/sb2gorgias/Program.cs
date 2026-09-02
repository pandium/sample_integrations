using System.Text.Json.Nodes;

using DotNetEnv;

using Microsoft.Extensions.Logging;

namespace Sb2Gorgias;

/// <summary>
/// Entry point. Both flows ship in one assembly and are selected by the run mode Pandium
/// sets on <c>PAN_CTX_RUN_MODE</c>. <c>Pandium.cs</c> holds the rest of the platform
/// contract and is the file to read first.
/// </summary>
internal static class Program
{
    /// <summary>
    /// A self-imposed deadline a minute inside Pandium's ten-minute run limit. A run that
    /// stops itself here still writes its cursor to stdout and exits 0, so Pandium counts it
    /// as a success and merges the cursor; a run that hits the hard limit is marked
    /// Failed (Timeout) and writes nothing.
    /// </summary>
    private static readonly TimeSpan Deadline = TimeSpan.FromMinutes(9);

    private static async Task<int> Main()
    {
        // Pandium delivers configs, secrets, and run context as environment variables. A
        // local .env stands in for them during development; real variables win.
        Env.Load(options: new LoadOptions(clobberExistingVars: false));

        // Every log level goes to stderr. Pandium reads the last non-empty line of stdout as
        // the run's metadata, so nothing else may write there.
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
                // A Gorgias ticket per ShipBob delivery bundled into this run.
                "webhook" => await WebhookFlow.RunAsync(pandium, loggerFactory, deadline.Token),

                // "init" (the first run after a tenant connects) and "normal" (scheduled and
                // manual runs) both take the order sync.
                _ => await CronFlow.RunAsync(pandium, loggerFactory, deadline.Token),
            };

            pandium.UpdateMetadata(metadata);
            return 0;
        }
        catch (Exception error)
        {
            // A non-zero exit with nothing on stdout marks the run failed and leaves the
            // tenant's stored metadata as the last successful run left it.
            logger.LogError(error, "the run failed; leaving tenant metadata untouched");
            return 1;
        }
    }

    /// <summary><c>LOG_LEVEL</c> (e.g. <c>debug</c>) changes verbosity without a rebuild.</summary>
    private static LogLevel MinimumLevel() =>
        Enum.TryParse<LogLevel>(Environment.GetEnvironmentVariable("LOG_LEVEL"), ignoreCase: true, out var level)
            ? level
            : LogLevel.Information;
}
