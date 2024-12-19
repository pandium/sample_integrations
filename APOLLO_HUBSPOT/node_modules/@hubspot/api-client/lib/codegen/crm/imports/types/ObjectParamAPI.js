"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPublicImportsApi = exports.ObjectCoreApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectCoreApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCoreApi(configuration, requestFactory, responseProcessor);
    }
    cancel(param, options) {
        return this.api.cancel(param.importId, options).toPromise();
    }
    create(param = {}, options) {
        return this.api.create(param.files, param.importRequest, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.importId, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.after, param.before, param.limit, options).toPromise();
    }
}
exports.ObjectCoreApi = ObjectCoreApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectPublicImportsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservablePublicImportsApi(configuration, requestFactory, responseProcessor);
    }
    getErrors(param, options) {
        return this.api.getErrors(param.importId, param.after, param.limit, options).toPromise();
    }
}
exports.ObjectPublicImportsApi = ObjectPublicImportsApi;
//# sourceMappingURL=ObjectParamAPI.js.map