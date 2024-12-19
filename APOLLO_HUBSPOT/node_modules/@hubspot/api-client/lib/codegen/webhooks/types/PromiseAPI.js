"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseSubscriptionsApi = exports.PromiseSettingsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseSettingsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableSettingsApi(configuration, requestFactory, responseProcessor);
    }
    clear(appId, _options) {
        const result = this.api.clear(appId, _options);
        return result.toPromise();
    }
    configure(appId, settingsChangeRequest, _options) {
        const result = this.api.configure(appId, settingsChangeRequest, _options);
        return result.toPromise();
    }
    getAll(appId, _options) {
        const result = this.api.getAll(appId, _options);
        return result.toPromise();
    }
}
exports.PromiseSettingsApi = PromiseSettingsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromiseSubscriptionsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSubscriptionsApi(configuration, requestFactory, responseProcessor);
    }
    archive(subscriptionId, appId, _options) {
        const result = this.api.archive(subscriptionId, appId, _options);
        return result.toPromise();
    }
    create(appId, subscriptionCreateRequest, _options) {
        const result = this.api.create(appId, subscriptionCreateRequest, _options);
        return result.toPromise();
    }
    getAll(appId, _options) {
        const result = this.api.getAll(appId, _options);
        return result.toPromise();
    }
    getById(subscriptionId, appId, _options) {
        const result = this.api.getById(subscriptionId, appId, _options);
        return result.toPromise();
    }
    update(subscriptionId, appId, subscriptionPatchRequest, _options) {
        const result = this.api.update(subscriptionId, appId, subscriptionPatchRequest, _options);
        return result.toPromise();
    }
    updateBatch(appId, batchInputSubscriptionBatchUpdateRequest, _options) {
        const result = this.api.updateBatch(appId, batchInputSubscriptionBatchUpdateRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseSubscriptionsApi = PromiseSubscriptionsApi;
//# sourceMappingURL=PromiseAPI.js.map