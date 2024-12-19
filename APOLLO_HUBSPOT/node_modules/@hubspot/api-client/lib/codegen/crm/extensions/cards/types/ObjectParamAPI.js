"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSampleResponseApi = exports.ObjectCardsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectCardsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCardsApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.appId, param.cardId, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.appId, param.cardCreateRequest, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.appId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.appId, param.cardId, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.appId, param.cardId, param.cardPatchRequest, options).toPromise();
    }
}
exports.ObjectCardsApi = ObjectCardsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectSampleResponseApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSampleResponseApi(configuration, requestFactory, responseProcessor);
    }
    getCardsSampleResponse(param = {}, options) {
        return this.api.getCardsSampleResponse(options).toPromise();
    }
}
exports.ObjectSampleResponseApi = ObjectSampleResponseApi;
//# sourceMappingURL=ObjectParamAPI.js.map