"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseOwnersApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseOwnersApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableOwnersApi(configuration, requestFactory, responseProcessor);
    }
    getById(ownerId, idProperty, archived, _options) {
        const result = this.api.getById(ownerId, idProperty, archived, _options);
        return result.toPromise();
    }
    getPage(email, after, limit, archived, _options) {
        const result = this.api.getPage(email, after, limit, archived, _options);
        return result.toPromise();
    }
}
exports.PromiseOwnersApi = PromiseOwnersApi;
//# sourceMappingURL=PromiseAPI.js.map