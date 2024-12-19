"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseSettingsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseSettingsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableSettingsApi(configuration, requestFactory, responseProcessor);
    }
    archive(appId, _options) {
        const result = this.api.archive(appId, _options);
        return result.toPromise();
    }
    create(appId, settingsRequest, _options) {
        const result = this.api.create(appId, settingsRequest, _options);
        return result.toPromise();
    }
    getById(appId, _options) {
        const result = this.api.getById(appId, _options);
        return result.toPromise();
    }
    update(appId, settingsPatchRequest, _options) {
        const result = this.api.update(appId, settingsPatchRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseSettingsApi = PromiseSettingsApi;
//# sourceMappingURL=PromiseAPI.js.map