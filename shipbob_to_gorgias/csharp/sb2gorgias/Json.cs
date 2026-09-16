using System.Text.Json;
using System.Text.Json.Nodes;

namespace Sb2Gorgias;

/// <summary>
/// The serializer options both API clients share, and accessors for the JSON this
/// integration does not model.
/// </summary>
public static class Json
{
    /// <summary>
    /// Web defaults skip the many fields both APIs send that this integration does not
    /// read; the naming policy maps their snake_case onto the PascalCase records in
    /// <c>ShipBob.cs</c>.
    /// </summary>
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
    };

    /// <summary>Deserialize <paramref name="text"/> using <see cref="Options"/>.</summary>
    public static T? Deserialize<T>(string text) => JsonSerializer.Deserialize<T>(text, Options);

    // Accessors for untyped JSON. Each takes a nullable receiver and answers null for a
    // missing key, a JSON null, or a value of the wrong shape, so a path such as
    // `order.Field("recipient").Field("address").AsText()` reads straight through with no
    // null checks along the way. JsonNode's own indexer would throw on the last two.

    /// <summary>The value at <paramref name="key"/>, or null unless this is an object with that key.</summary>
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
