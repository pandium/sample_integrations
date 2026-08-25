package sb2gorgias

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeFormatterBuilder
import java.time.format.DateTimeParseException
import java.time.temporal.ChronoField
import java.time.temporal.ChronoUnit

/**
 * Timestamp parsing and formatting shared by both flows.
 *
 * Between them the two APIs and the connection settings form send RFC 3339 with an
 * offset (`2026-07-05T10:00:00.1234567+00:00`), the same without one, and a bare
 * `2026-07-01`. Everything is normalised to UTC-without-an-offset — [LocalDateTime] —
 * so that comparing cursors never has to think about offsets.
 */

/** All three shapes above, as one formatter with the parts that vary made optional. */
private val FLEXIBLE: DateTimeFormatter =
    DateTimeFormatterBuilder()
        .append(DateTimeFormatter.ISO_LOCAL_DATE)
        .optionalStart()
        .appendLiteral('T')
        .append(DateTimeFormatter.ISO_LOCAL_TIME)
        .optionalStart()
        .appendOffsetId()
        .optionalEnd()
        .optionalEnd()
        .toFormatter()

/** How the metadata cursor and ShipBob's query parameters want a timestamp written. */
private val ISO: DateTimeFormatter =
    DateTimeFormatterBuilder()
        .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
        // Fractional seconds only when there are any, which is what both APIs send.
        .appendFraction(ChronoField.NANO_OF_SECOND, 0, 6, true)
        .toFormatter()

/** How a ShipBob timestamp reads on the Gorgias customer sidebar. */
private val DISPLAY: DateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss 'UTC'")

/**
 * Parse a timestamp from either API into UTC, or `null` if it is not a shape we
 * recognise.
 *
 * `parseBest` hands back the most specific type the text actually supports, so the
 * `when` below is the whole difference between the three shapes.
 */
fun parseTimestamp(value: String?): LocalDateTime? {
    val text = value?.trim().orEmpty()
    if (text.isEmpty()) return null
    return try {
        when (val parsed = FLEXIBLE.parseBest(text, OffsetDateTime::from, LocalDateTime::from, LocalDate::from)) {
            is OffsetDateTime -> parsed.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime()
            is LocalDateTime -> parsed
            is LocalDate -> parsed.atStartOfDay()
            else -> null
        }
    } catch (_: DateTimeParseException) {
        null
    }
}

/** Render a timestamp for the metadata cursor and for ShipBob's query parameters. */
fun isoTimestamp(value: LocalDateTime): String = value.truncatedTo(ChronoUnit.MICROS).format(ISO)

/**
 * Render a ShipBob timestamp for the Gorgias customer sidebar, passing anything
 * unparseable through unchanged.
 */
fun displayTimestamp(value: String?): String = parseTimestamp(value)?.format(DISPLAY) ?: value.orEmpty()
