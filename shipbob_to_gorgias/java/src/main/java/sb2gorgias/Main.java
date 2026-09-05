package sb2gorgias;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONObject;

final class Main {
    private static final Logger LOGGER = Pandium.newLogger("main");

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
        LOGGER.log(Level.INFO, "Syncing ShipBob to Gorgias; this run is in mode: " + pandium.runMode());

        JSONObject metadata;
        try {
            metadata = run(pandium.runMode(), pandium);
        } catch (RuntimeException e) {
            LOGGER.log(Level.SEVERE, "run failed: " + e.getMessage());
            System.exit(1);
            return;
        }
        pandium.updateMetadata(metadata);
    }
}
