package sb2gorgias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;

class ClientsTest {

    private static String token(String iss) {
        String json = new JSONObject().put("iss", iss).toString();
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes(StandardCharsets.UTF_8));
        return "header." + payload + ".sig";
    }

    @Test
    void shipBobBaseUrlResolvedFromTokenIssuer() {
        assertEquals("https://sandbox-api.shipbob.com/2026-01",
                ShipBobApi.resolveBaseUrl(token("https://authstage.shipbob.com")));
        assertEquals("https://api.shipbob.com/2026-01", ShipBobApi.resolveBaseUrl(token("https://auth.shipbob.com")));
        assertEquals(ShipBobApi.DEFAULT_BASE_URL, ShipBobApi.resolveBaseUrl("not-a-jwt")); // malformed -> prod
    }

    /** The cron loop stops on an empty page and commits its cursor there, so only an
     * exhausted query may answer with one. */
    @Test
    void shipBobOrderPageRaisesInsteadOfReportingItselfEmpty() {
        ShipBobApi api = new ShipBobApi(Helpers.pandium()
                .secrets(Map.of("shipbob_access_token", token("https://auth.shipbob.com")))
                .build());
        OffsetDateTime start = OffsetDateTime.parse("2026-07-01T00:00:00Z");

        api.httpClient.requester = (method, url, body) -> new HttpClient.RawResponse(200, "[]");
        assertEquals(List.of(), api.newOrdersPage(start, 1)); // exhausted

        // 500 (not one of the retryable statuses) so this fails on the first attempt instead
        // of sleeping through backoff retries.
        api.httpClient.requester = (method, url, body) -> new HttpClient.RawResponse(500, "server error");
        assertThrows(RuntimeException.class, () -> api.newOrdersPage(start, 1)); // a failure, not an empty page

        api.httpClient.requester = (method, url, body) -> new HttpClient.RawResponse(200, "{\"errors\":[\"nope\"]}");
        assertThrows(RuntimeException.class, () -> api.newOrdersPage(start, 1)); // a 200 that is not a page of orders either
    }

    @Test
    void gorgiasOauthBuildsBaseUrlAndBearerHeader() {
        GorgiasApi api = new GorgiasApi(Helpers.pandium().secrets(Helpers.GORGIAS_SECRETS).build());
        assertEquals("https://acme.gorgias.com/api", api.apiUrl);
        assertEquals("Bearer gorgias-token-123", api.httpClient.authorization());
    }

    @Test
    void gorgiasCustomerKeyIsEmailOrSynthetic() {
        assertEquals("jane@example.com", GorgiasApi.customerKey(Helpers.makeOrder(1, "x", "jane@example.com")));
        assertEquals("Buyer 1 Main St NY US", GorgiasApi.customerKey(Helpers.makeOrder(1, "x", null)));
    }
}
