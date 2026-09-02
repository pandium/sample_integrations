using System.Collections;
using System.Text.Json.Nodes;

using Microsoft.Extensions.Logging;

namespace sb2gorgias;

/// <summary>
/// A single webhook trigger's headers and parsed body. Kept as separate members (rather
/// than one combined node) so callers can log each on its own line.
/// </summary>
public sealed record WebhookPayload(JsonNode? Headers, JsonNode? Body);

/// <summary>
/// Everything Pandium hands to an integration at runtime. <see cref="Config"/>
/// (<c>PAN_CFG_*</c>) and <see cref="Secrets"/> (<c>PAN_SEC_*</c>) hold arbitrary keys
/// defined per integration and are exposed as plain dictionaries. Context
/// (<c>PAN_CTX_*</c>) is controlled by Pandium, so its values are surfaced through named
/// members.
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

    /// <summary>The run mode for this invocation (e.g. <c>init</c>, <c>webhook</c>).</summary>
    public string? RunMode => _context.GetValueOrDefault("run_mode");

    /// <summary>
    /// The triggers that caused this run, parsed from JSON. Relevant for webhook
    /// invocations, where each trigger's <c>payload.file</c> names a file holding the raw
    /// webhook body.
    /// </summary>
    public IEnumerable<JsonNode?> RunTriggers
    {
        get
        {
            var raw = _context.GetValueOrDefault("run_triggers");
            if (string.IsNullOrEmpty(raw))
            {
                return [];
            }

            try
            {
                return JsonNode.Parse(raw) as JsonArray ?? [];
            }
            catch (Exception error)
            {
                _logger.LogError("could not parse run triggers as JSON: {Raw}: {Error}", raw, error.Message);
                return [];
            }
        }
    }

    /// <summary>The tenant metadata persisted by the previous run, parsed as JSON.</summary>
    public JsonNode? Metadata => _metadata.Value;

    /// <summary>
    /// The webhook payloads for this run: each trigger's headers and parsed body, read from
    /// the file its <c>payload.file</c> names. Relevant for webhook invocations.
    /// </summary>
    public IReadOnlyList<WebhookPayload> WebhookPayloads()
    {
        var payloads = new List<WebhookPayload>();
        foreach (var trigger in RunTriggers)
        {
            if (AsString(trigger?["mode"]) != "webhook")
            {
                continue;
            }

            var payload = trigger?["payload"];
            if (AsString(payload?["file"]) is not { } file)
            {
                continue;
            }

            try
            {
                payloads.Add(new WebhookPayload(payload?["headers"], JsonNode.Parse(File.ReadAllText(file))));
            }
            catch (Exception error)
            {
                _logger.LogError("could not read webhook payload {File}: {Error}", file, error.Message);
            }
        }

        return payloads;
    }

    /// <summary>
    /// Merge <paramref name="metadata"/> into the tenant metadata that the next run reads
    /// back. Pandium reads the last non-empty line of stdout as the metadata, so anything
    /// printed to stdout after this call replaces it.
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
            if (entry.Key is string key && entry.Value is string value && key.StartsWith(prefix, StringComparison.Ordinal))
            {
                items[key[prefix.Length..].ToLowerInvariant()] = value;
            }
        }

        return items;
    }

    /// <summary>
    /// The node's value when it holds a JSON string, and null for every other node type.
    /// Reading a node of the wrong type throws, so callers that cannot trust the shape of
    /// their JSON go through here.
    /// </summary>
    private static string? AsString(JsonNode? node) =>
        node is JsonValue value && value.TryGetValue<string>(out var text) ? text : null;

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
            _logger.LogError("could not read tenant metadata from {File}: {Error}", filename, error.Message);
            return null;
        }
    }
}
