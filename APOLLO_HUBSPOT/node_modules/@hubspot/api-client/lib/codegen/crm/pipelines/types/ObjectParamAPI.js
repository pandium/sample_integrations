"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPipelinesApi = exports.ObjectPipelineStagesApi = exports.ObjectPipelineStageAuditsApi = exports.ObjectPipelineAuditsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectPipelineAuditsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePipelineAuditsApi(configuration, requestFactory, responseProcessor);
    }
    getAudit(param, options) {
        return this.api.getAudit(param.objectType, param.pipelineId, options).toPromise();
    }
}
exports.ObjectPipelineAuditsApi = ObjectPipelineAuditsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectPipelineStageAuditsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservablePipelineStageAuditsApi(configuration, requestFactory, responseProcessor);
    }
    getAudit(param, options) {
        return this.api.getAudit(param.objectType, param.stageId, options).toPromise();
    }
}
exports.ObjectPipelineStageAuditsApi = ObjectPipelineStageAuditsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectPipelineStagesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservablePipelineStagesApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.objectType, param.pipelineId, param.stageId, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.objectType, param.pipelineId, param.pipelineStageInput, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.objectType, param.pipelineId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectType, param.pipelineId, param.stageId, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.objectType, param.pipelineId, param.stageId, param.pipelineStageInput, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectType, param.pipelineId, param.stageId, param.pipelineStagePatchInput, options).toPromise();
    }
}
exports.ObjectPipelineStagesApi = ObjectPipelineStagesApi;
const ObservableAPI_4 = require("./ObservableAPI");
class ObjectPipelinesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservablePipelinesApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.objectType, param.pipelineId, param.validateReferencesBeforeDelete, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.objectType, param.pipelineInput, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.objectType, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectType, param.pipelineId, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.objectType, param.pipelineId, param.pipelineInput, param.validateReferencesBeforeDelete, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectType, param.pipelineId, param.pipelinePatchInput, param.validateReferencesBeforeDelete, options).toPromise();
    }
}
exports.ObjectPipelinesApi = ObjectPipelinesApi;
//# sourceMappingURL=ObjectParamAPI.js.map