"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectBlogTagsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectBlogTagsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBlogTagsApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.objectId, param.archived, options).toPromise();
    }
    archiveBatch(param, options) {
        return this.api.archiveBatch(param.batchInputString, options).toPromise();
    }
    attachToLangGroup(param, options) {
        return this.api.attachToLangGroup(param.attachToLangPrimaryRequestVNext, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.tag, options).toPromise();
    }
    createBatch(param, options) {
        return this.api.createBatch(param.batchInputTag, options).toPromise();
    }
    createLangVariation(param, options) {
        return this.api.createLangVariation(param.tagCloneRequestVNext, options).toPromise();
    }
    detachFromLangGroup(param, options) {
        return this.api.detachFromLangGroup(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectId, param.archived, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, options).toPromise();
    }
    readBatch(param, options) {
        return this.api.readBatch(param.batchInputString, param.archived, options).toPromise();
    }
    setLangPrimary(param, options) {
        return this.api.setLangPrimary(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectId, param.tag, param.archived, options).toPromise();
    }
    updateBatch(param, options) {
        return this.api.updateBatch(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateLangs(param, options) {
        return this.api.updateLangs(param.updateLanguagesRequestVNext, options).toPromise();
    }
}
exports.ObjectBlogTagsApi = ObjectBlogTagsApi;
//# sourceMappingURL=ObjectParamAPI.js.map