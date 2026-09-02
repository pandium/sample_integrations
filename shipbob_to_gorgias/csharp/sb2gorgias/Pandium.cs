using System.Collections;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

namespace Sb2Gorgias;

/// <summary>
/// One webhook delivery handed to this run: the raw request body Pandium received, plus
/// the trigger id from <c>PAN_CTX_RUN_TRIGGERS</c> for correlating with the run log.
/// </summary>
public sealed record WebhookDelivery(string Id, string Body);

/// <summary>
/// The Pandium runtime contract, in one place.
///
/// Everything Pandium hands an integration arrives as an environment variable.
/// <c>PAN_CFG_*</c> holds the tenant's connection settings (<see cref="Config"/>),
/// <c>PAN_SEC_*</c> the credentials its connectors produced (<see cref="Secrets"/>), and
/// <c>PAN_CTX_*</c> the run context. The first two are keyed per integration, so they are
/// plain dictionaries; the context is controlled by Pandium, so it gets named, typed
/// members. State flows the other way through <see cref="UpdateMetadata"/>.
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

    /// <summary>
    /// The tenant's connection settings, keyed by the property names in the
    /// <c>PANDIUM.yaml</c> config schema.
    /// </summary>
    public IReadOnlyDictionary<string, string> Config { get; }

    /// <summary>The credentials the tenant's connectors produced, keyed by secret name.</summary>
    public IReadOnlyDictionary<string, string> Secrets { get; }

    /// <summary>A boolean config. Every config reaches the run as text, so a ticked checkbox is <c>"true"</c>.</summary>
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

    /// <summary>
    /// What caused this run, parsed from <c>PAN_CTX_RUN_TRIGGERS</c>: one entry per
    /// schedule tick, manual run, or webhook delivery.
    /// </summary>
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
    /// The tenant's stored metadata, read from the file named by
    /// <c>PAN_CTX_TENANT_METADATA_FILE</c>. It holds whatever previous runs have merged in
    /// through <see cref="UpdateMetadata"/>. Missing or unreadable metadata comes back as
    /// null, which the accessors in <c>Json.cs</c> index like an empty object.
    /// </summary>
    public JsonNode? Metadata => _metadata.Value;

    /// <summary>
    /// The webhook deliveries bundled into this run.
    ///
    /// Pandium receives each delivery, writes the raw body to disk, and lists it as a
    /// trigger whose <c>payload.file</c> names that file. Triggers are debounced per
    /// tenant, so a webhook run carries N of these, not one.
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
    /// Hand <paramref name="metadata"/> back to Pandium for the next run to read.
    ///
    /// Pandium validates the last non-empty line of stdout against the manifest's
    /// <c>metadata_schema</c> and shallow-merges it into the tenant's stored metadata, so
    /// this is the only thing a run writes to stdout.
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
