"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseBlogPostsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseBlogPostsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBlogPostsApi(configuration, requestFactory, responseProcessor);
    }
    archive(objectId, archived, _options) {
        const result = this.api.archive(objectId, archived, _options);
        return result.toPromise();
    }
    archiveBatch(batchInputString, _options) {
        const result = this.api.archiveBatch(batchInputString, _options);
        return result.toPromise();
    }
    attachToLangGroup(attachToLangPrimaryRequestVNext, _options) {
        const result = this.api.attachToLangGroup(attachToLangPrimaryRequestVNext, _options);
        return result.toPromise();
    }
    clone(contentCloneRequestVNext, _options) {
        const result = this.api.clone(contentCloneRequestVNext, _options);
        return result.toPromise();
    }
    create(blogPost, _options) {
        const result = this.api.create(blogPost, _options);
        return result.toPromise();
    }
    createBatch(batchInputBlogPost, _options) {
        const result = this.api.createBatch(batchInputBlogPost, _options);
        return result.toPromise();
    }
    createLangVariation(blogPostLanguageCloneRequestVNext, _options) {
        const result = this.api.createLangVariation(blogPostLanguageCloneRequestVNext, _options);
        return result.toPromise();
    }
    detachFromLangGroup(detachFromLangGroupRequestVNext, _options) {
        const result = this.api.detachFromLangGroup(detachFromLangGroupRequestVNext, _options);
        return result.toPromise();
    }
    getById(objectId, archived, _options) {
        const result = this.api.getById(objectId, archived, _options);
        return result.toPromise();
    }
    getDraftById(objectId, _options) {
        const result = this.api.getDraftById(objectId, _options);
        return result.toPromise();
    }
    getPage(createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, sort, after, limit, archived, _options) {
        const result = this.api.getPage(createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, sort, after, limit, archived, _options);
        return result.toPromise();
    }
    getPreviousVersion(objectId, revisionId, _options) {
        const result = this.api.getPreviousVersion(objectId, revisionId, _options);
        return result.toPromise();
    }
    getPreviousVersions(objectId, after, before, limit, _options) {
        const result = this.api.getPreviousVersions(objectId, after, before, limit, _options);
        return result.toPromise();
    }
    pushLive(objectId, _options) {
        const result = this.api.pushLive(objectId, _options);
        return result.toPromise();
    }
    readBatch(batchInputString, archived, _options) {
        const result = this.api.readBatch(batchInputString, archived, _options);
        return result.toPromise();
    }
    resetDraft(objectId, _options) {
        const result = this.api.resetDraft(objectId, _options);
        return result.toPromise();
    }
    restorePreviousVersion(objectId, revisionId, _options) {
        const result = this.api.restorePreviousVersion(objectId, revisionId, _options);
        return result.toPromise();
    }
    restorePreviousVersionToDraft(objectId, revisionId, _options) {
        const result = this.api.restorePreviousVersionToDraft(objectId, revisionId, _options);
        return result.toPromise();
    }
    schedule(contentScheduleRequestVNext, _options) {
        const result = this.api.schedule(contentScheduleRequestVNext, _options);
        return result.toPromise();
    }
    setLangPrimary(setNewLanguagePrimaryRequestVNext, _options) {
        const result = this.api.setLangPrimary(setNewLanguagePrimaryRequestVNext, _options);
        return result.toPromise();
    }
    update(objectId, blogPost, archived, _options) {
        const result = this.api.update(objectId, blogPost, archived, _options);
        return result.toPromise();
    }
    updateBatch(batchInputJsonNode, archived, _options) {
        const result = this.api.updateBatch(batchInputJsonNode, archived, _options);
        return result.toPromise();
    }
    updateDraft(objectId, blogPost, _options) {
        const result = this.api.updateDraft(objectId, blogPost, _options);
        return result.toPromise();
    }
    updateLangs(updateLanguagesRequestVNext, _options) {
        const result = this.api.updateLangs(updateLanguagesRequestVNext, _options);
        return result.toPromise();
    }
}
exports.PromiseBlogPostsApi = PromiseBlogPostsApi;
//# sourceMappingURL=PromiseAPI.js.map