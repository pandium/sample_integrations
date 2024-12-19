"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSettingsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectSettingsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableSettingsApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.appId, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.appId, param.settingsRequest, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.appId, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.appId, param.settingsPatchRequest, options).toPromise();
    }
}
exports.ObjectSettingsApi = ObjectSettingsApi;
//# sourceMappingURL=ObjectParamAPI.js.map