"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisePipelinesApi = exports.PromisePipelineStagesApi = exports.PromisePipelineStageAuditsApi = exports.PromisePipelineAuditsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromisePipelineAuditsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePipelineAuditsApi(configuration, requestFactory, responseProcessor);
    }
    getAudit(objectType, pipelineId, _options) {
        const result = this.api.getAudit(objectType, pipelineId, _options);
        return result.toPromise();
    }
}
exports.PromisePipelineAuditsApi = PromisePipelineAuditsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromisePipelineStageAuditsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservablePipelineStageAuditsApi(configuration, requestFactory, responseProcessor);
    }
    getAudit(objectType, stageId, _options) {
        const result = this.api.getAudit(objectType, stageId, _options);
        return result.toPromise();
    }
}
exports.PromisePipelineStageAuditsApi = PromisePipelineStageAuditsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class PromisePipelineStagesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservablePipelineStagesApi(configuration, requestFactory, responseProcessor);
    }
    archive(objectType, pipelineId, stageId, _options) {
        const result = this.api.archive(objectType, pipelineId, stageId, _options);
        return result.toPromise();
    }
    create(objectType, pipelineId, pipelineStageInput, _options) {
        const result = this.api.create(objectType, pipelineId, pipelineStageInput, _options);
        return result.toPromise();
    }
    getAll(objectType, pipelineId, _options) {
        const result = this.api.getAll(objectType, pipelineId, _options);
        return result.toPromise();
    }
    getById(objectType, pipelineId, stageId, _options) {
        const result = this.api.getById(objectType, pipelineId, stageId, _options);
        return result.toPromise();
    }
    replace(objectType, pipelineId, stageId, pipelineStageInput, _options) {
        const result = this.api.replace(objectType, pipelineId, stageId, pipelineStageInput, _options);
        return result.toPromise();
    }
    update(objectType, pipelineId, stageId, pipelineStagePatchInput, _options) {
        const result = this.api.update(objectType, pipelineId, stageId, pipelineStagePatchInput, _options);
        return result.toPromise();
    }
}
exports.PromisePipelineStagesApi = PromisePipelineStagesApi;
const ObservableAPI_4 = require("./ObservableAPI");
class PromisePipelinesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservablePipelinesApi(configuration, requestFactory, responseProcessor);
    }
    archive(objectType, pipelineId, validateReferencesBeforeDelete, _options) {
        const result = this.api.archive(objectType, pipelineId, validateReferencesBeforeDelete, _options);
        return result.toPromise();
    }
    create(objectType, pipelineInput, _options) {
        const result = this.api.create(objectType, pipelineInput, _options);
        return result.toPromise();
    }
    getAll(objectType, _options) {
        const result = this.api.getAll(objectType, _options);
        return result.toPromise();
    }
    getById(objectType, pipelineId, _options) {
        const result = this.api.getById(objectType, pipelineId, _options);
        return result.toPromise();
    }
    replace(objectType, pipelineId, pipelineInput, validateReferencesBeforeDelete, _options) {
        const result = this.api.replace(objectType, pipelineId, pipelineInput, validateReferencesBeforeDelete, _options);
        return result.toPromise();
    }
    update(objectType, pipelineId, pipelinePatchInput, validateReferencesBeforeDelete, _options) {
        const result = this.api.update(objectType, pipelineId, pipelinePatchInput, validateReferencesBeforeDelete, _options);
        return result.toPromise();
    }
}
exports.PromisePipelinesApi = PromisePipelinesApi;
//# sourceMappingURL=PromiseAPI.js.map