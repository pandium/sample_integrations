"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectEventsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectEventsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.occurredAfter, param.occurredBefore, param.objectType, param.objectId, param.eventType, param.after, param.before, param.limit, param.sort, options).toPromise();
    }
}
exports.ObjectEventsApi = ObjectEventsApi;
//# sourceMappingURL=ObjectParamAPI.js.map