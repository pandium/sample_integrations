package sb2gorgias;

import java.time.OffsetDateTime;
import java.util.List;

import org.json.JSONObject;

/** What Cron depends on - satisfied by ShipBobApi and, in tests, by a fake. Java has no
 * runtime monkey-patching, so this interface has to exist from the start. */
interface ShipBobClient {
    List<JSONObject> newOrdersPage(OffsetDateTime startDate, int page);

    List<JSONObject> updatedOrdersPage(OffsetDateTime startDate, int page);

    OffsetDateTime updateDate(JSONObject order, OffsetDateTime startDate);
}
