"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseTokensApi = exports.PromiseTemplatesApi = exports.PromiseEventsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseEventsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }
    create(timelineEvent, _options) {
        const result = this.api.create(timelineEvent, _options);
        return result.toPromise();
    }
    createBatch(batchInputTimelineEvent, _options) {
        const result = this.api.createBatch(batchInputTimelineEvent, _options);
        return result.toPromise();
    }
    getById(eventTemplateId, eventId, _options) {
        const result = this.api.getById(eventTemplateId, eventId, _options);
        return result.toPromise();
    }
    getDetailById(eventTemplateId, eventId, _options) {
        const result = this.api.getDetailById(eventTemplateId, eventId, _options);
        return result.toPromise();
    }
    getRenderById(eventTemplateId, eventId, detail, _options) {
        const result = this.api.getRenderById(eventTemplateId, eventId, detail, _options);
        return result.toPromise();
    }
}
exports.PromiseEventsApi = PromiseEventsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromiseTemplatesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableTemplatesApi(configuration, requestFactory, responseProcessor);
    }
    archive(eventTemplateId, appId, _options) {
        const result = this.api.archive(eventTemplateId, appId, _options);
        return result.toPromise();
    }
    create(appId, timelineEventTemplateCreateRequest, _options) {
        const result = this.api.create(appId, timelineEventTemplateCreateRequest, _options);
        return result.toPromise();
    }
    getAll(appId, _options) {
        const result = this.api.getAll(appId, _options);
        return result.toPromise();
    }
    getById(eventTemplateId, appId, _options) {
        const result = this.api.getById(eventTemplateId, appId, _options);
        return result.toPromise();
    }
    update(eventTemplateId, appId, timelineEventTemplateUpdateRequest, _options) {
        const result = this.api.update(eventTemplateId, appId, timelineEventTemplateUpdateRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseTemplatesApi = PromiseTemplatesApi;
const ObservableAPI_3 = require("./ObservableAPI");
class PromiseTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableTokensApi(configuration, requestFactory, responseProcessor);
    }
    archive(eventTemplateId, tokenName, appId, _options) {
        const result = this.api.archive(eventTemplateId, tokenName, appId, _options);
        return result.toPromise();
    }
    create(eventTemplateId, appId, timelineEventTemplateToken, _options) {
        const result = this.api.create(eventTemplateId, appId, timelineEventTemplateToken, _options);
        return result.toPromise();
    }
    update(eventTemplateId, tokenName, appId, timelineEventTemplateTokenUpdateRequest, _options) {
        const result = this.api.update(eventTemplateId, tokenName, appId, timelineEventTemplateTokenUpdateRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseTokensApi = PromiseTokensApi;
//# sourceMappingURL=PromiseAPI.js.map