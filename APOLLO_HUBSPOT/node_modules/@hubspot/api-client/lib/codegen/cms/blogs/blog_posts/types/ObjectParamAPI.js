"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectBlogPostsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectBlogPostsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBlogPostsApi(configuration, requestFactory, responseProcessor);
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
    clone(param, options) {
        return this.api.clone(param.contentCloneRequestVNext, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.blogPost, options).toPromise();
    }
    createBatch(param, options) {
        return this.api.createBatch(param.batchInputBlogPost, options).toPromise();
    }
    createLangVariation(param, options) {
        return this.api.createLangVariation(param.blogPostLanguageCloneRequestVNext, options).toPromise();
    }
    detachFromLangGroup(param, options) {
        return this.api.detachFromLangGroup(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectId, param.archived, options).toPromise();
    }
    getDraftById(param, options) {
        return this.api.getDraftById(param.objectId, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, options).toPromise();
    }
    getPreviousVersion(param, options) {
        return this.api.getPreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    getPreviousVersions(param, options) {
        return this.api.getPreviousVersions(param.objectId, param.after, param.before, param.limit, options).toPromise();
    }
    pushLive(param, options) {
        return this.api.pushLive(param.objectId, options).toPromise();
    }
    readBatch(param, options) {
        return this.api.readBatch(param.batchInputString, param.archived, options).toPromise();
    }
    resetDraft(param, options) {
        return this.api.resetDraft(param.objectId, options).toPromise();
    }
    restorePreviousVersion(param, options) {
        return this.api.restorePreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersionToDraft(param, options) {
        return this.api.restorePreviousVersionToDraft(param.objectId, param.revisionId, options).toPromise();
    }
    schedule(param, options) {
        return this.api.schedule(param.contentScheduleRequestVNext, options).toPromise();
    }
    setLangPrimary(param, options) {
        return this.api.setLangPrimary(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectId, param.blogPost, param.archived, options).toPromise();
    }
    updateBatch(param, options) {
        return this.api.updateBatch(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateDraft(param, options) {
        return this.api.updateDraft(param.objectId, param.blogPost, options).toPromise();
    }
    updateLangs(param, options) {
        return this.api.updateLangs(param.updateLanguagesRequestVNext, options).toPromise();
    }
}
exports.ObjectBlogPostsApi = ObjectBlogPostsApi;
//# sourceMappingURL=ObjectParamAPI.js.map