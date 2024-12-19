"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTokensApi = exports.ObjectTemplatesApi = exports.ObjectEventsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectEventsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }
    create(param, options) {
        return this.api.create(param.timelineEvent, options).toPromise();
    }
    createBatch(param, options) {
        return this.api.createBatch(param.batchInputTimelineEvent, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.eventTemplateId, param.eventId, options).toPromise();
    }
    getDetailById(param, options) {
        return this.api.getDetailById(param.eventTemplateId, param.eventId, options).toPromise();
    }
    getRenderById(param, options) {
        return this.api.getRenderById(param.eventTemplateId, param.eventId, param.detail, options).toPromise();
    }
}
exports.ObjectEventsApi = ObjectEventsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectTemplatesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableTemplatesApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.eventTemplateId, param.appId, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.appId, param.timelineEventTemplateCreateRequest, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.appId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.eventTemplateId, param.appId, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.eventTemplateId, param.appId, param.timelineEventTemplateUpdateRequest, options).toPromise();
    }
}
exports.ObjectTemplatesApi = ObjectTemplatesApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableTokensApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.eventTemplateId, param.tokenName, param.appId, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.eventTemplateId, param.appId, param.timelineEventTemplateToken, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.eventTemplateId, param.tokenName, param.appId, param.timelineEventTemplateTokenUpdateRequest, options).toPromise();
    }
}
exports.ObjectTokensApi = ObjectTokensApi;
//# sourceMappingURL=ObjectParamAPI.js.map