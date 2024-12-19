"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectOwnersApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectOwnersApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableOwnersApi(configuration, requestFactory, responseProcessor);
    }
    getById(param, options) {
        return this.api.getById(param.ownerId, param.idProperty, param.archived, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.email, param.after, param.limit, param.archived, options).toPromise();
    }
}
exports.ObjectOwnersApi = ObjectOwnersApi;
//# sourceMappingURL=ObjectParamAPI.js.map