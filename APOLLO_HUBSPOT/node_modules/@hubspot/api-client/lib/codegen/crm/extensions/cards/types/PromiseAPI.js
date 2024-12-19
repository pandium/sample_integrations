"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseSampleResponseApi = exports.PromiseCardsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseCardsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCardsApi(configuration, requestFactory, responseProcessor);
    }
    archive(appId, cardId, _options) {
        const result = this.api.archive(appId, cardId, _options);
        return result.toPromise();
    }
    create(appId, cardCreateRequest, _options) {
        const result = this.api.create(appId, cardCreateRequest, _options);
        return result.toPromise();
    }
    getAll(appId, _options) {
        const result = this.api.getAll(appId, _options);
        return result.toPromise();
    }
    getById(appId, cardId, _options) {
        const result = this.api.getById(appId, cardId, _options);
        return result.toPromise();
    }
    update(appId, cardId, cardPatchRequest, _options) {
        const result = this.api.update(appId, cardId, cardPatchRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseCardsApi = PromiseCardsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromiseSampleResponseApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSampleResponseApi(configuration, requestFactory, responseProcessor);
    }
    getCardsSampleResponse(_options) {
        const result = this.api.getCardsSampleResponse(_options);
        return result.toPromise();
    }
}
exports.PromiseSampleResponseApi = PromiseSampleResponseApi;
//# sourceMappingURL=PromiseAPI.js.map