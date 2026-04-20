package hubspot2s3;

import java.util.HashMap;
import java.util.Map;

final class Config {
	private static Map<String, String> dic = new HashMap<String, String>();

	public static final void fromEnv() {
		Map<String, String> env = System.getenv();
		for (String envName : env.keySet()) {
			if (envName.startsWith("PAN_CFG_")) {
				dic.put(envName.replace("PAN_CFG_", "").toLowerCase(),
						env.get(envName).replace("\\n", "").replace("\n", ""));
			}
		}
	}

	public static final String getValue(String key) {
		if (dic.containsKey(key)) {
			return dic.get(key);
		} else {
			return "";
		}
	}
}

final class Secrets {
	private static Map<String, String> dic = new HashMap<String, String>();

	public static final void fromEnv() {
		Map<String, String> env = System.getenv();
		for (String envName : env.keySet()) {
			if (envName.startsWith("PAN_SEC_")) {
				dic.put(envName.replace("PAN_SEC_", "").toLowerCase(),
						env.get(envName).replace("\\n", "").replace("\n", ""));
			}
		}
	}

	public static final String getValue(String key) {
		if (dic.containsKey(key)) {
			return dic.get(key);
		} else {
			return "";
		}
	}
}

final class Context {
	private static Map<String, String> dic = new HashMap<String, String>();

	private Context() {
	}

	public static final void fromEnv() {
		Map<String, String> env = System.getenv();
		for (String envName : env.keySet()) {
			if (envName.startsWith("PAN_CTX_")) {
				dic.put(envName.replace("PAN_CTX_", "").toLowerCase(),
						env.get(envName).replace("\\n", "").replace("\n", ""));
			}
		}
	}

	public static final String getValue(String key) {
		if (dic.containsKey(key)) {
			return dic.get(key);
		} else {
			return "";
		}
	}
}
