package sb2gorgias;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import org.json.JSONObject;

/** Small shared helpers used across the ShipBob/Gorgias clients and the cron/webhook flows. */
final class Util {
    private Util() {
    }

    /** Safe nested lookup by dotted path, e.g. {@code deepGet(order, "recipient.address.city", "")}. */
    static Object deepGet(Object data, String path, Object def) {
        Object cur = data;
        for (String part : path.split("\\.")) {
            if (!(cur instanceof JSONObject json)) {
                return def;
            }
            cur = json.opt(part);
        }
        return (cur == null || cur == JSONObject.NULL) ? def : cur;
    }

    static String asString(Object v) {
        return v instanceof String s ? s : "";
    }

    static long toLong(Object v) {
        return v instanceof Number n ? n.longValue() : 0;
    }

    static String trimTo(String s, int n) {
        return s.length() > n ? s.substring(0, n) : s;
    }

    private static final DateTimeFormatter[] TIMESTAMP_LAYOUTS = {
        DateTimeFormatter.ISO_OFFSET_DATE_TIME,
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss[.SSSSSS]"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
    };

    /** Parses a ShipBob- or Pandium-shaped timestamp string, trying progressively looser
     * layouts. Empty when unparseable. A value with no offset is treated as UTC. ISO_OFFSET_DATE_TIME
     * accepts any number of fractional digits, so ShipBob's 7-digit fractions parse as-is. */
    static Optional<OffsetDateTime> parseTimestamp(String value) {
        if (value == null || value.isEmpty()) {
            return Optional.empty();
        }
        for (DateTimeFormatter layout : TIMESTAMP_LAYOUTS) {
            try {
                var accessor = layout.parseBest(value, OffsetDateTime::from, LocalDateTime::from, LocalDate::from);
                if (accessor instanceof OffsetDateTime odt) {
                    return Optional.of(odt.withOffsetSameInstant(ZoneOffset.UTC));
                }
                if (accessor instanceof LocalDateTime ldt) {
                    return Optional.of(ldt.atOffset(ZoneOffset.UTC));
                }
                if (accessor instanceof LocalDate ld) {
                    return Optional.of(ld.atStartOfDay().atOffset(ZoneOffset.UTC));
                }
            } catch (DateTimeParseException ignored) {
                // try the next, looser layout
            }
        }
        return Optional.empty();
    }
}
