"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRedirectsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectRedirectsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableRedirectsApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.urlRedirectId, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.urlMappingCreateRequestBody, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.urlRedirectId, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.urlRedirectId, param.urlMapping, options).toPromise();
    }
}
exports.ObjectRedirectsApi = ObjectRedirectsApi;
//# sourceMappingURL=ObjectParamAPI.js.map