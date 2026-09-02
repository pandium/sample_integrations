using System.Text.Json;
using System.Text.Json.Nodes;

namespace Sb2Gorgias;

/// <summary>
/// The JSON codec both API clients share, and the accessors for the JSON this integration
/// does not model.
/// </summary>
public static class Json
{
    /// <summary>
    /// One set of options, configured once, doing the work that would otherwise be a
    /// <c>[JsonPropertyName]</c> on every property of every record in <c>ShipBob.cs</c>.
    /// Unknown properties are skipped by default, which matters because both APIs send far
    /// more than this integration reads and add fields over time.
    /// </summary>
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        // Both APIs speak snake_case; the records stay PascalCase, as C# does.
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
    };

    /// <summary>Deserialize <paramref name="text"/> using <see cref="Options"/>.</summary>
    public static T? Deserialize<T>(string text) => JsonSerializer.Deserialize<T>(text, Options);

    // --- reading JSON this integration does not model -----------------------------
    //
    // These extensions all take a *nullable* receiver, so reading into a raw order needs no
    // null checks along the way: `order.Field("recipient").Field("address").AsText()`. A
    // missing key, a JSON null, and a value of the wrong shape all answer null.
    //
    // JsonNode's own indexer would throw on the second and third of those, which is the
    // reason to go through here rather than write `order["recipient"]?["address"]`.

    /// <summary>The value at <paramref name="key"/>, or null unless this really is an object with that key.</summary>
    public static JsonNode? Field(this JsonNode? node, string key) =>
        node is JsonObject item && item.TryGetPropertyValue(key, out var value) ? value : null;

    /// <summary>The value as a string, or null if it is absent or is not a JSON string.</summary>
    public static string? AsText(this JsonNode? node) =>
        node is JsonValue value && value.TryGetValue<string>(out var text) ? text : null;

    /// <summary>The value as a whole number, or null if it is absent or is not one.</summary>
    public static long? AsNumber(this JsonNode? node) =>
        node is JsonValue value && value.TryGetValue<long>(out var number) ? number : null;

    /// <summary>The value as an object, or null if it is absent or is not one.</summary>
    public static JsonObject? AsMap(this JsonNode? node) => node as JsonObject;

    /// <summary>The value's elements, or nothing at all if it is absent or is not an array.</summary>
    public static IReadOnlyList<JsonNode?> AsList(this JsonNode? node) =>
        node is JsonArray array ? [.. array] : [];
}
