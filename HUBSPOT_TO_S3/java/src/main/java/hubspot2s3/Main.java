package hubspot2s3;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.json.JSONArray;
import org.json.JSONObject;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;

public class Main {

	private static Logger logger = Logger.getLogger(Main.class.getName());

	public static void main(String[] args) {
		logger.setLevel(Level.INFO);

		Config.fromEnv();
		Secrets.fromEnv();
		Context.fromEnv();

		System.out.println("This run is in mode: context.run_mode");

		HubSpot hubSpot = new HubSpot(Secrets.getValue("hubspot_api_key"),
				Secrets.getValue("hubspot_oauth_access_token"));

		System.out.println(Config.getValue("s3_bucket_name"));

		S3 s3File = new S3(Secrets.getValue("aws_access_key_id"), Secrets.getValue("aws_secret_access_key"),
				Config.getValue("s3_bucket_name"), Config.getValue("s3_file_name"), Config.getValue("s3_region_name"));

		try {
			Reader targetReader = new InputStreamReader(s3File.getInputStream());
			CSVFormat csvFormat = CSVFormat.DEFAULT.withFirstRecordAsHeader();
			CSVParser csvParser = csvFormat.parse(targetReader);

			List<CSVRecord> records = csvParser.getRecords();

			for (CSVRecord csvRecord : records) {
				if (Config.getValue("make_contact") != "") {
					logger.info("Creating Contact: " + csvRecord);
					HttpResponse<JsonNode> resp = hubSpot.create("contacts", hubSpotContactFromRow(csvRecord));
					logger.info(resp.getStatusText());
				}
				if (Config.getValue("make_company") != "") {
					logger.info("Creating Company: " + csvRecord);
					HttpResponse<JsonNode> resp = hubSpot.create("companies", hubSpotCompanyFromRow(csvRecord));
					logger.info(resp.getStatusText());
				}
			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static String hubSpotContactFromRow(CSVRecord record) {
		JSONArray contactArray = new JSONArray();
		JSONObject contact = new JSONObject();
		JSONObject email = new JSONObject();
		email.put("property", "email");
		email.put("value", record.get("email"));
		contactArray.put(email);
		JSONObject firstname = new JSONObject();
		firstname.put("property", "firstname");
		firstname.put("value", record.get("first_name"));
		contactArray.put(firstname);
		JSONObject lastname = new JSONObject();
		lastname.put("property", "lastname");
		lastname.put("value", record.get("last_name"));
		contactArray.put(lastname);
		JSONObject company = new JSONObject();
		company.put("property", "company");
		company.put("value", record.get("company"));
		contactArray.put(company);
		JSONObject city = new JSONObject();
		city.put("property", "city");
		city.put("value", record.get("city"));
		contactArray.put(city);
		JSONObject state = new JSONObject();
		state.put("property", "state");
		state.put("value", record.get("state"));
		contactArray.put(state);
		JSONObject country = new JSONObject();
		country.put("property", "country");
		country.put("value", record.get("country"));
		contactArray.put(country);
		JSONObject zip = new JSONObject();
		zip.put("property", "zip");
		zip.put("value", record.get("zip"));
		contactArray.put(zip);
		contact.put("properties", contactArray);
		return contact.toString();
	}

	public static String hubSpotCompanyFromRow(CSVRecord record) {
		JSONArray companyArray = new JSONArray();
		JSONObject company = new JSONObject();
		JSONObject name = new JSONObject();
		name.put("name", "name");
		name.put("value", record.get("company"));
		companyArray.put(name);
		JSONObject description = new JSONObject();
		description.put("name", "description");
		description.put("value", record.get("desc"));
		companyArray.put(description);
		company.put("properties", companyArray);
		return company.toString();
	}
}
