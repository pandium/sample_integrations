"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseEventsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseEventsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }
    getPage(occurredAfter, occurredBefore, objectType, objectId, eventType, after, before, limit, sort, _options) {
        const result = this.api.getPage(occurredAfter, occurredBefore, objectType, objectId, eventType, after, before, limit, sort, _options);
        return result.toPromise();
    }
}
exports.PromiseEventsApi = PromiseEventsApi;
//# sourceMappingURL=PromiseAPI.js.map