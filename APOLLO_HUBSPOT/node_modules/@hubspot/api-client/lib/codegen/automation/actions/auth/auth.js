"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthMethods = exports.Oauth2Authentication = exports.DeveloperHapikeyAuthentication = void 0;
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
class Oauth2Authentication {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }
    getName() {
        return "oauth2";
    }
    applySecurityAuthentication(context) {
        context.setHeaderParam("Authorization", "Bearer " + this.accessToken);
    }
}
exports.Oauth2Authentication = Oauth2Authentication;
function configureAuthMethods(config) {
    let authMethods = {};
    if (!config) {
        return authMethods;
    }
    authMethods["default"] = config["default"];
    if (config["developer_hapikey"]) {
        authMethods["developer_hapikey"] = new DeveloperHapikeyAuthentication(config["developer_hapikey"]);
    }
    if (config["oauth2"]) {
        authMethods["oauth2"] = new Oauth2Authentication(config["oauth2"]["accessToken"]);
    }
    return authMethods;
}
exports.configureAuthMethods = configureAuthMethods;
//# sourceMappingURL=auth.js.map