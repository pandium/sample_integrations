package sb2gorgias;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;

/** The cron and webhook flows must resolve "the same customer" via the same GorgiasApi
 * helpers - guards against them drifting on how a recipient maps to a key. */
class ParityTest {

    @Test
    void customerKeyResolvesTheSameKeyForAMatchingRecipientAcrossAnOrderAndAShipmentEvent() {
        JSONObject order = Helpers.makeOrder(1, "2026-07-01T00:00:00Z", "jane@example.com");
        JSONObject event = Helpers.makeShipmentEvent(1, "Delivered", "jane@example.com", null);

        assertEquals(GorgiasApi.customerKey(order), GorgiasApi.customerKey(event));
    }
}
