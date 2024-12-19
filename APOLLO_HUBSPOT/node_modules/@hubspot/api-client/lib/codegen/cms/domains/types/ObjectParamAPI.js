"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectDomainsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectDomainsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableDomainsApi(configuration, requestFactory, responseProcessor);
    }
    getById(param, options) {
        return this.api.getById(param.domainId, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, options).toPromise();
    }
}
exports.ObjectDomainsApi = ObjectDomainsApi;
//# sourceMappingURL=ObjectParamAPI.js.map