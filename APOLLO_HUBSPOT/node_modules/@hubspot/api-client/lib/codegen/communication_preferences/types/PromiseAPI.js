"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseStatusApi = exports.PromiseDefinitionApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseDefinitionApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableDefinitionApi(configuration, requestFactory, responseProcessor);
    }
    getPage(_options) {
        const result = this.api.getPage(_options);
        return result.toPromise();
    }
}
exports.PromiseDefinitionApi = PromiseDefinitionApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromiseStatusApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableStatusApi(configuration, requestFactory, responseProcessor);
    }
    getEmailStatus(emailAddress, _options) {
        const result = this.api.getEmailStatus(emailAddress, _options);
        return result.toPromise();
    }
    subscribe(publicUpdateSubscriptionStatusRequest, _options) {
        const result = this.api.subscribe(publicUpdateSubscriptionStatusRequest, _options);
        return result.toPromise();
    }
    unsubscribe(publicUpdateSubscriptionStatusRequest, _options) {
        const result = this.api.unsubscribe(publicUpdateSubscriptionStatusRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseStatusApi = PromiseStatusApi;
//# sourceMappingURL=PromiseAPI.js.map