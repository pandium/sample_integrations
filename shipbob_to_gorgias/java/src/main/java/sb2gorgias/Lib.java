package sb2gorgias;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.github.cdimascio.dotenv.Dotenv;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    private static final Logger LOGGER = LoggerFactory.getLogger("lib");

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

    // Reads a local .env for dev, merged with the real environment (which always wins); any
    // failure to read .env - missing, malformed, unreadable - falls back to the real environment
    // alone, since a dev-only convenience file must never be able to block a run.
    private static final Map<String, String> RAW_ENV = loadEnv();

    private static Map<String, String> loadEnv() {
        try {
            Map<String, String> raw = new HashMap<>();
            for (var entry : Dotenv.configure().ignoreIfMissing().ignoreIfMalformed().load().entries()) {
                raw.put(entry.getKey(), entry.getValue());
            }
            return raw;
        } catch (RuntimeException e) {
            return System.getenv();
        }
    }

    static Pandium fromEnv() {
        return new Pandium(fromEnvPrefix("PAN_CFG_"), fromEnvPrefix("PAN_SEC_"), fromEnvPrefix("PAN_CTX_"));
    }

    /** Collects environment variables starting with prefix, stripping the prefix and
     * lower-casing the remaining key. */
    private static Map<String, String> fromEnvPrefix(String prefix) {
        Map<String, String> result = new HashMap<>();
        for (Map.Entry<String, String> entry : RAW_ENV.entrySet()) {
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
            LOGGER.error("could not parse run triggers as JSON: {}", raw, e);
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
                LOGGER.warn("webhook trigger {} has no payload file", trigger.opt("id"));
                continue;
            }
            try {
                String body = Files.readString(Paths.get(file), StandardCharsets.UTF_8);
                Object idVal = trigger.opt("id");
                deliveries.add(new WebhookDelivery(idVal == null ? "" : String.valueOf(idVal), body));
            } catch (IOException e) {
                LOGGER.error("could not read webhook payload {}", file, e);
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
            LOGGER.error("could not read tenant metadata from {}", filename, e);
        }
        return metadataCache;
    }

    /** Merges metadata into the tenant metadata that the next run reads back. Pandium reads
     * the last non-empty line of stdout as the metadata, so anything printed to stdout after
     * this call replaces it. */
    void updateMetadata(JSONObject metadata) {
        String serialized = metadata.toString();
        LOGGER.info("updating metadata with {}", serialized);
        System.out.println(serialized);
    }
}
