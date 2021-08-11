package hubspot2s3;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;

class HubSpot {

	private static Logger logger = Logger.getLogger(Main.class.getName());
	private String headers = "";
	private String queryString = "";

	HubSpot(String hubSpotApiKey, String hubSpotAccessToken) {
		if (hubSpotApiKey != "") {
			queryString = hubSpotApiKey;
		} else if (hubSpotAccessToken != "") {
			headers = "Bearer " + hubSpotAccessToken;
		}
	}

	public static String relativeEntityUrl(String entity, String key) {
		Map<String, String> v1 = new HashMap<String, String>();
		v1.put("contacts", "contact");
		Map<String, String> v2 = new HashMap<String, String>();
		v2.put("companies", "companies");

		String rtn = "";

		if (v1.containsKey(entity)) {
			rtn = entity + "/v1/" + v1.get(entity);
		} else {
			rtn = entity + "/v2/" + v2.get(entity);
		}

		if (key != "") {
			rtn += "/" + key;
		}

		return rtn;
	}

	public String absoluteUrl(String relative) {
		return "https://api.hubapi.com/" + relative;
	}

	public String getFqdn(String entity, String key) {
		System.out.println(relativeEntityUrl(entity, key));
		return absoluteUrl(relativeEntityUrl(entity, key));
	}

	private HttpResponse<JsonNode> get(String url, String data) {
		HttpResponse<JsonNode> response = Unirest.get(url).header("Content-Type", "application/json")
				.queryString("hapikey", queryString).header("Authorization", headers).asJson();

		return response;
	}

	private HttpResponse<JsonNode> post(String url, String data) {
		HttpResponse<JsonNode> response = Unirest.post(url).header("Content-Type", "application/json")
				.queryString("hapikey", queryString).header("Authorization", headers).body(data).asJson();

		return response;
	}

	private HttpResponse<JsonNode> put(String url, String data) {
		HttpResponse<JsonNode> response = Unirest.put(url).header("Content-Type", "application/json")
				.queryString("hapikey", queryString).header("Authorization", headers).body(data).asJson();
		return response;
	}

	public HttpResponse<JsonNode> create(String entity, String data) {
		logger.info("Attempting to create a " + entity);
		return post(getFqdn(entity, ""), data);

	}

	public HttpResponse<JsonNode> replace(String entity, String key, String data) {
		logger.info("Attempting to replace a " + entity + "/" + key);
		return put(getFqdn(entity, key), data);
	}
}
