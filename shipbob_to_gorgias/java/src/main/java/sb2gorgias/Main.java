package sb2gorgias;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

final class Main {
    private static final Logger LOGGER = LoggerFactory.getLogger("main");

    private Main() {
    }

    static JSONObject run(String mode, Pandium pandium) {
        if ("webhook".equals(mode)) {
            return Webhook.webhookRun(pandium);
        }
        return Cron.cronRun(pandium);
    }

    public static void main(String[] args) {
        Pandium pandium = Pandium.fromEnv();
        LOGGER.info("syncing ShipBob to Gorgias; run_mode={}", pandium.runMode());

        JSONObject metadata;
        try {
            metadata = run(pandium.runMode(), pandium);
        } catch (RuntimeException e) {
            LOGGER.error("run failed", e);
            System.exit(1);
            return;
        }
        pandium.updateMetadata(metadata);
    }
}
