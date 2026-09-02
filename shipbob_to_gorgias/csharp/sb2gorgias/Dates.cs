using System.Globalization;

namespace Sb2Gorgias;

/// <summary>
/// Timestamp parsing and formatting shared by both flows. Everything is normalised to UTC,
/// so the cursors stored in tenant metadata compare without thinking about offsets.
/// </summary>
public static class Dates
{
    /// <summary>
    /// How the metadata cursors and ShipBob's query parameters want a timestamp written.
    /// Fractional seconds print only when there are any.
    /// </summary>
    private const string IsoFormat = "yyyy-MM-dd'T'HH:mm:ss.FFFFFF";

    /// <summary>How a ShipBob timestamp reads on the Gorgias customer sidebar.</summary>
    private const string DisplayFormat = "dd/MM/yyyy HH:mm:ss 'UTC'";

    /// <summary>
    /// Parse a timestamp into UTC, or null if it is not one. Covers the three shapes the
    /// APIs and the settings form send: RFC 3339 with an offset, the same without one, and
    /// a bare <c>2026-07-01</c>. Text without an offset is taken to be UTC already.
    /// </summary>
    public static DateTime? ParseTimestamp(string? value) =>
        DateTime.TryParse(
            value,
            CultureInfo.InvariantCulture,
            DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal,
            out var parsed)
            ? parsed
            : null;

    /// <summary>Render a timestamp for the metadata cursors and for ShipBob's query parameters.</summary>
    public static string IsoTimestamp(DateTime value) => value.ToString(IsoFormat, CultureInfo.InvariantCulture);

    /// <summary>
    /// Render a ShipBob timestamp for the Gorgias customer sidebar, passing anything
    /// unparseable through unchanged.
    /// </summary>
    public static string DisplayTimestamp(string? value) =>
        ParseTimestamp(value)?.ToString(DisplayFormat, CultureInfo.InvariantCulture) ?? value ?? "";
}
