"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseDomainsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseDomainsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableDomainsApi(configuration, requestFactory, responseProcessor);
    }
    getById(domainId, _options) {
        const result = this.api.getById(domainId, _options);
        return result.toPromise();
    }
    getPage(createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, sort, after, limit, archived, _options) {
        const result = this.api.getPage(createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, sort, after, limit, archived, _options);
        return result.toPromise();
    }
}
exports.PromiseDomainsApi = PromiseDomainsApi;
//# sourceMappingURL=PromiseAPI.js.map