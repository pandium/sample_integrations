"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisePublicApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromisePublicApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePublicApi(configuration, requestFactory, responseProcessor);
    }
    getById(contentId, type, _options) {
        const result = this.api.getById(contentId, type, _options);
        return result.toPromise();
    }
    search(q, limit, offset, language, matchPrefix, autocomplete, popularityBoost, boostLimit, boostRecent, tableId, hubdbQuery, domain, type, pathPrefix, property, length, groupId, _options) {
        const result = this.api.search(q, limit, offset, language, matchPrefix, autocomplete, popularityBoost, boostLimit, boostRecent, tableId, hubdbQuery, domain, type, pathPrefix, property, length, groupId, _options);
        return result.toPromise();
    }
}
exports.PromisePublicApi = PromisePublicApi;
//# sourceMappingURL=PromiseAPI.js.map