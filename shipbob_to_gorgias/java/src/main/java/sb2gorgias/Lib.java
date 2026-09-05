package sb2gorgias;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.ConsoleHandler;
import java.util.logging.Formatter;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Formats log lines as "[timestamp] [module] LEVEL: message". Logs go to stderr; stdout is
 * reserved for the JSON metadata Pandium reads back. Prints Level.SEVERE as "ERROR", matching
 * the other language ports - java.util.logging's own naming is the outlier here.
 */
final class LineFormatter extends Formatter {
    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final String module;

    LineFormatter(String module) {
        this.module = module;
    }

    @Override
    public String format(LogRecord record) {
        String timestamp = TIMESTAMP_FORMAT.format(Instant.ofEpochMilli(record.getMillis()).atZone(ZoneId.systemDefault()));
        String level = record.getLevel() == Level.SEVERE ? "ERROR" : record.getLevel().getName();
        return String.format("[%s] [%s] %s: %s%n", timestamp, module, level, record.getMessage());
    }
}

/** One webhook delivery handed to this run: the raw request body, plus the trigger id, which
 * is useful for correlating with the run log. */
record WebhookDelivery(String id, String body) {
}

/**
 * Everything Pandium hands to an integration at runtime. config (PAN_CFG_*) and secrets
 * (PAN_SEC_*) hold arbitrary keys defined per integration, so they are looked up by free-text
 * name. context (PAN_CTX_*) is controlled by Pandium, so its values are exposed through named
 * methods instead.
 */
final class Pandium {
    private static final Logger LOGGER = newLogger("lib");

    final Map<String, String> config;
    final Map<String, String> secrets;
    private final Map<String, String> context;
    private JSONObject metadataCache;
    private boolean metadataLoaded;

    Pandium(Map<String, String> config, Map<String, String> secrets, Map<String, String> context) {
        this.config = config;
        this.secrets = secrets;
        this.context = context;
    }

    /** Returns a logger scoped to the calling file, named after it. */
    static Logger newLogger(String module) {
        Logger logger = Logger.getAnonymousLogger();
        logger.setUseParentHandlers(false);
        ConsoleHandler handler = new ConsoleHandler();
        handler.setFormatter(new LineFormatter(module));
        logger.addHandler(handler);
        return logger;
    }

    static Pandium fromEnv() {
        return new Pandium(fromEnvPrefix("PAN_CFG_"), fromEnvPrefix("PAN_SEC_"), fromEnvPrefix("PAN_CTX_"));
    }

    /** Collects environment variables starting with prefix, stripping the prefix and
     * lower-casing the remaining key. */
    private static Map<String, String> fromEnvPrefix(String prefix) {
        Map<String, String> result = new HashMap<>();
        for (Map.Entry<String, String> entry : System.getenv().entrySet()) {
            if (entry.getKey().startsWith(prefix)) {
                result.put(entry.getKey().substring(prefix.length()).toLowerCase(), entry.getValue());
            }
        }
        return result;
    }

    /** The run mode for this invocation (e.g. "init", "webhook"). */
    String runMode() {
        return context.get("run_mode");
    }

    /** The triggers that caused this run, parsed from JSON. Relevant for webhook invocations,
     * where each trigger's payload.file names a file holding the raw webhook body. */
    JSONArray runTriggers() {
        String raw = context.get("run_triggers");
        if (raw == null || raw.isEmpty()) {
            return new JSONArray();
        }
        try {
            return new JSONArray(raw);
        } catch (JSONException e) {
            LOGGER.log(Level.SEVERE, "could not parse run triggers as JSON: " + raw + ": " + e.getMessage());
            return new JSONArray();
        }
    }

    /** The webhook deliveries bundled into this run.
     *
     * Pandium debounces triggers per tenant, so deliveries that arrive while a run is in
     * flight are bundled into the next one - a webhook run carries N of these, not one. */
    List<WebhookDelivery> webhookDeliveries() {
        List<WebhookDelivery> deliveries = new ArrayList<>();
        JSONArray triggers = runTriggers();
        for (int i = 0; i < triggers.length(); i++) {
            JSONObject trigger = triggers.optJSONObject(i);
            if (trigger == null || !"webhook".equals(trigger.opt("source"))) {
                continue;
            }
            JSONObject payload = trigger.optJSONObject("payload");
            String file = payload == null ? null : payload.optString("file", null);
            if (file == null || file.isEmpty()) {
                LOGGER.log(Level.WARNING, "webhook trigger " + trigger.opt("id") + " has no payload file");
                continue;
            }
            try {
                String body = Files.readString(Paths.get(file), StandardCharsets.UTF_8);
                Object idVal = trigger.opt("id");
                deliveries.add(new WebhookDelivery(idVal == null ? "" : String.valueOf(idVal), body));
            } catch (IOException e) {
                LOGGER.log(Level.SEVERE, "could not read webhook payload " + file + ": " + e.getMessage());
            }
        }
        return deliveries;
    }

    /** The tenant metadata persisted by the previous run, parsed as JSON. Returns null if
     * there is none or it could not be read/parsed. Read once and cached, since it never
     * changes within a run. */
    JSONObject metadata() {
        if (metadataLoaded) {
            return metadataCache;
        }
        metadataLoaded = true;
        String filename = context.get("tenant_metadata_file");
        if (filename == null || filename.isEmpty()) {
            return null;
        }
        try {
            String raw = Files.readString(Paths.get(filename), StandardCharsets.UTF_8);
            metadataCache = new JSONObject(raw);
        } catch (IOException | JSONException e) {
            LOGGER.log(Level.SEVERE, "could not read tenant metadata from " + filename + ": " + e.getMessage());
        }
        return metadataCache;
    }

    /** Merges metadata into the tenant metadata that the next run reads back. Pandium reads
     * the last non-empty line of stdout as the metadata, so anything printed to stdout after
     * this call replaces it. */
    void updateMetadata(JSONObject metadata) {
        String serialized = metadata.toString();
        LOGGER.log(Level.INFO, "updating metadata with " + serialized);
        System.out.println(serialized);
    }
}
