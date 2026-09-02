using System.Collections;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

namespace Sb2Gorgias;

/// <summary>
/// One webhook delivery handed to this run: the raw request body, plus the trigger
/// <paramref name="Id"/>, which is useful for correlating with the run log.
/// </summary>
public sealed record WebhookDelivery(string Id, string Body);

/// <summary>
/// The Pandium runtime contract.
///
/// Everything Pandium hands to an integration arrives as an environment variable.
/// <c>PAN_CFG_*</c> (<see cref="Config"/>) and <c>PAN_SEC_*</c> (<see cref="Secrets"/>)
/// hold keys defined per integration, so they are plain dictionaries. <c>PAN_CTX_*</c>
/// (the run context) is controlled by Pandium, so it gets named, typed members instead.
/// </summary>
public sealed class Pandium
{
    private readonly IReadOnlyDictionary<string, string> _context;
    private readonly ILogger<Pandium> _logger;
    private readonly Lazy<JsonNode?> _metadata;

    private Pandium(
        IReadOnlyDictionary<string, string> config,
        IReadOnlyDictionary<string, string> secrets,
        IReadOnlyDictionary<string, string> context,
        ILogger<Pandium> logger)
    {
        Config = config;
        Secrets = secrets;
        _context = context;
        _logger = logger;
        _metadata = new Lazy<JsonNode?>(ReadMetadata);
    }

    public static Pandium FromEnv(ILoggerFactory loggerFactory) => new(
        WithPrefix("PAN_CFG_"),
        WithPrefix("PAN_SEC_"),
        WithPrefix("PAN_CTX_"),
        loggerFactory.CreateLogger<Pandium>());

    /// <summary>A tenant's configs, keyed by config name.</summary>
    public IReadOnlyDictionary<string, string> Config { get; }

    /// <summary>A tenant's secrets, keyed by secret name.</summary>
    public IReadOnlyDictionary<string, string> Secrets { get; }

    /// <summary>A boolean config: every config reaches the run as text, so a ticked box is <c>"true"</c>.</summary>
    public bool Flag(string key) =>
        string.Equals(Config.GetValueOrDefault(key), "true", StringComparison.OrdinalIgnoreCase);

    /// <summary>
    /// A secret the integration cannot run without. The message names the environment
    /// variable, so a misconfigured connector shows up in the run log rather than as a 401.
    /// </summary>
    public string RequireSecret(string key) =>
        Secrets.GetValueOrDefault(key) is { Length: > 0 } secret
            ? secret
            : throw new InvalidOperationException($"PAN_SEC_{key.ToUpperInvariant()} is required");

    /// <summary>The run mode for this invocation: <c>init</c>, <c>normal</c>, or <c>webhook</c>.</summary>
    public string? RunMode => _context.GetValueOrDefault("run_mode");

    /// <summary>The triggers that caused this run, parsed from JSON.</summary>
    public IReadOnlyList<JsonNode?> RunTriggers
    {
        get
        {
            if (_context.GetValueOrDefault("run_triggers") is not { Length: > 0 } raw)
            {
                return [];
            }

            try
            {
                return JsonNode.Parse(raw).AsList();
            }
            catch (Exception error)
            {
                _logger.LogError(error, "could not parse run triggers as JSON: {Raw}", raw);
                return [];
            }
        }
    }

    /// <summary>
    /// Tenant metadata, typically persisted by the previous run. Missing or unreadable
    /// metadata comes back as null, which the accessors in <c>Json.cs</c> index like an
    /// empty object.
    /// </summary>
    public JsonNode? Metadata => _metadata.Value;

    /// <summary>
    /// The webhook deliveries bundled into this run.
    ///
    /// Pandium debounces triggers per tenant, so a webhook run carries N of these, not one.
    /// Each raw request body is written to disk and named by its trigger; this reads them.
    /// </summary>
    public IReadOnlyList<WebhookDelivery> WebhookDeliveries()
    {
        var deliveries = new List<WebhookDelivery>();
        foreach (var trigger in RunTriggers.Where(trigger => trigger.Field("source").AsText() == "webhook"))
        {
            var id = trigger.Field("id").AsText() ?? "";
            if (trigger.Field("payload").Field("file").AsText() is not { } file)
            {
                _logger.LogWarning("webhook trigger {Id} has no payload file", id);
                continue;
            }

            try
            {
                deliveries.Add(new WebhookDelivery(id, File.ReadAllText(file)));
            }
            catch (Exception error)
            {
                _logger.LogError(error, "could not read webhook payload {File}", file);
            }
        }

        return deliveries;
    }

    /// <summary>
    /// Merge <paramref name="metadata"/> into the tenant metadata for the next run to read
    /// back.
    ///
    /// Pandium shallow-merges the last non-empty line of stdout into the tenant's stored
    /// metadata, so this is the only thing a run writes to stdout — logs go to stderr (see
    /// the logger factory in <c>Program.cs</c>).
    /// </summary>
    public void UpdateMetadata(JsonNode metadata)
    {
        var json = metadata.ToJsonString();
        _logger.LogInformation("updating metadata with {Metadata}", json);
        Console.Out.WriteLine(json);
    }

    /// <summary>
    /// Collect environment variables starting with <paramref name="prefix"/>, stripping the
    /// prefix and lower-casing the remaining key.
    /// </summary>
    private static Dictionary<string, string> WithPrefix(string prefix)
    {
        var items = new Dictionary<string, string>();
        foreach (DictionaryEntry entry in Environment.GetEnvironmentVariables())
        {
            if (entry.Key is string key && entry.Value is string value &&
                key.StartsWith(prefix, StringComparison.Ordinal))
            {
                items[key[prefix.Length..].ToLowerInvariant()] = value;
            }
        }

        return items;
    }

    private JsonNode? ReadMetadata()
    {
        if (_context.GetValueOrDefault("tenant_metadata_file") is not { Length: > 0 } filename)
        {
            return null;
        }

        try
        {
            return JsonNode.Parse(File.ReadAllText(filename));
        }
        catch (Exception error)
        {
            _logger.LogError(error, "could not read tenant metadata from {File}", filename);
            return null;
        }
    }
}
