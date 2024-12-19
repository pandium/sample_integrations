"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisePublicImportsApi = exports.PromiseCoreApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseCoreApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCoreApi(configuration, requestFactory, responseProcessor);
    }
    cancel(importId, _options) {
        const result = this.api.cancel(importId, _options);
        return result.toPromise();
    }
    create(files, importRequest, _options) {
        const result = this.api.create(files, importRequest, _options);
        return result.toPromise();
    }
    getById(importId, _options) {
        const result = this.api.getById(importId, _options);
        return result.toPromise();
    }
    getPage(after, before, limit, _options) {
        const result = this.api.getPage(after, before, limit, _options);
        return result.toPromise();
    }
}
exports.PromiseCoreApi = PromiseCoreApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromisePublicImportsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservablePublicImportsApi(configuration, requestFactory, responseProcessor);
    }
    getErrors(importId, after, limit, _options) {
        const result = this.api.getErrors(importId, after, limit, _options);
        return result.toPromise();
    }
}
exports.PromisePublicImportsApi = PromisePublicImportsApi;
//# sourceMappingURL=PromiseAPI.js.map