using System.Text.Json.Nodes;

using DotNetEnv;

using Microsoft.Extensions.Logging;

namespace sb2gorgias;

internal static class Program
{
    private static void Main()
    {
        // Pandium sets secrets, configs, and context as environment variables; a local .env
        // file stands in for them during development. Real environment variables win over
        // anything a stray .env sets.
        Env.Load(options: new LoadOptions(clobberExistingVars: false));

        // Logs go to stderr; stdout carries the JSON metadata Pandium reads back.
        using var loggerFactory = LoggerFactory.Create(builder => builder
            .SetMinimumLevel(LogLevel.Debug)
            .AddConsole(options => options.LogToStandardErrorThreshold = LogLevel.Trace)
            .AddSimpleConsole(options =>
            {
                options.SingleLine = true;
                options.TimestampFormat = "yyyy-MM-dd HH:mm:ss.fff ";
            }));
        var logger = loggerFactory.CreateLogger(typeof(Program));

        var pandium = Pandium.FromEnv(loggerFactory);

        logger.LogInformation("Hello from a Pandium integration, written in C#!");
        logger.LogInformation("This run is in mode: {RunMode}", pandium.RunMode);

        pandium.UpdateMetadata(Run(pandium.RunMode, pandium, logger));
    }

    /// <summary>The business logic of the run varies depending on the run mode.</summary>
    private static JsonObject Run(string? mode, Pandium pandium, ILogger logger)
    {
        switch (mode)
        {
            case "init":
                // Init mode: report which secrets are available and populate tenant metadata
                // with the dynamic config values needed for the customer-facing config form.
                // In the real world, these values would be derived from an api call.
                logger.LogInformation("The available secrets are: {Secrets}", string.Join(", ", pandium.Secrets.Keys));
                return new JsonObject
                {
                    ["dynamic_colors"] = new JsonArray("red", "green", "purple", "orange", "yellow"),
                };

            case "webhook":
                // Webhook mode: log each trigger's headers and body. This version emits no
                // metadata, but there is no reason not to update metadata from here.
                foreach (var payload in pandium.WebhookPayloads())
                {
                    logger.LogInformation("headers: {Headers}", payload.Headers?.ToJsonString());
                    logger.LogInformation("body: {Body}", payload.Body?.ToJsonString());
                }

                return new JsonObject();

            default:
                // Normal mode: log the config, then log the previous normal run's random
                // number and store a fresh random number as metadata.
                logger.LogInformation(
                    "Tenant configs: {Configs}",
                    string.Join(", ", pandium.Config.Select(config => $"{config.Key}: {config.Value}")));
                var newRandomNumber = Random.Shared.Next(1_000_000);
                if (pandium.Metadata is JsonObject previous)
                {
                    logger.LogInformation("last run's random number: {RandomNumber}", previous["random_number"]);
                }

                logger.LogInformation("new random number: {RandomNumber}", newRandomNumber);
                return new JsonObject { ["random_number"] = newRandomNumber };
        }
    }
}
