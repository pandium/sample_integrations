"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPublicApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectPublicApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePublicApi(configuration, requestFactory, responseProcessor);
    }
    getById(param, options) {
        return this.api.getById(param.contentId, param.type, options).toPromise();
    }
    search(param = {}, options) {
        return this.api.search(param.q, param.limit, param.offset, param.language, param.matchPrefix, param.autocomplete, param.popularityBoost, param.boostLimit, param.boostRecent, param.tableId, param.hubdbQuery, param.domain, param.type, param.pathPrefix, param.property, param.length, param.groupId, options).toPromise();
    }
}
exports.ObjectPublicApi = ObjectPublicApi;
//# sourceMappingURL=ObjectParamAPI.js.map