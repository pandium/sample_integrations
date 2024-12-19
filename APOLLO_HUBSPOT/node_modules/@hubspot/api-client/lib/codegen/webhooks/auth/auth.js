"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthMethods = exports.DeveloperHapikeyAuthentication = void 0;
class DeveloperHapikeyAuthentication {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    getName() {
        return "developer_hapikey";
    }
    applySecurityAuthentication(context) {
        context.setQueryParam("hapikey", this.apiKey);
    }
}
exports.DeveloperHapikeyAuthentication = DeveloperHapikeyAuthentication;
function configureAuthMethods(config) {
    let authMethods = {};
    if (!config) {
        return authMethods;
    }
    authMethods["default"] = config["default"];
    if (config["developer_hapikey"]) {
        authMethods["developer_hapikey"] = new DeveloperHapikeyAuthentication(config["developer_hapikey"]);
    }
    return authMethods;
}
exports.configureAuthMethods = configureAuthMethods;
//# sourceMappingURL=auth.js.map