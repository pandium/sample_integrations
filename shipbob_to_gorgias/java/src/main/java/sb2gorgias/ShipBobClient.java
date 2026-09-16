package sb2gorgias;

import java.time.OffsetDateTime;
import java.util.List;

import org.json.JSONObject;

/** What Cron depends on - satisfied by ShipBobApi and, in tests, by a fake. Java has no
 * runtime monkey-patching, so this interface has to exist from the start. */
interface ShipBobClient {
    List<JSONObject> newOrdersPage(OffsetDateTime startDate, int page);

    /** now is the run's fixed current time, needed to sort by ShipBobApi.updateDate without
     * re-reading the real clock mid-sort. */
    List<JSONObject> updatedOrdersPage(OffsetDateTime startDate, int page, OffsetDateTime now);
}
