"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseBlogTagsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseBlogTagsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBlogTagsApi(configuration, requestFactory, responseProcessor);
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
    create(tag, _options) {
        const result = this.api.create(tag, _options);
        return result.toPromise();
    }
    createBatch(batchInputTag, _options) {
        const result = this.api.createBatch(batchInputTag, _options);
        return result.toPromise();
    }
    createLangVariation(tagCloneRequestVNext, _options) {
        const result = this.api.createLangVariation(tagCloneRequestVNext, _options);
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
    getPage(createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, sort, after, limit, archived, _options) {
        const result = this.api.getPage(createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, sort, after, limit, archived, _options);
        return result.toPromise();
    }
    readBatch(batchInputString, archived, _options) {
        const result = this.api.readBatch(batchInputString, archived, _options);
        return result.toPromise();
    }
    setLangPrimary(setNewLanguagePrimaryRequestVNext, _options) {
        const result = this.api.setLangPrimary(setNewLanguagePrimaryRequestVNext, _options);
        return result.toPromise();
    }
    update(objectId, tag, archived, _options) {
        const result = this.api.update(objectId, tag, archived, _options);
        return result.toPromise();
    }
    updateBatch(batchInputJsonNode, archived, _options) {
        const result = this.api.updateBatch(batchInputJsonNode, archived, _options);
        return result.toPromise();
    }
    updateLangs(updateLanguagesRequestVNext, _options) {
        const result = this.api.updateLangs(updateLanguagesRequestVNext, _options);
        return result.toPromise();
    }
}
exports.PromiseBlogTagsApi = PromiseBlogTagsApi;
//# sourceMappingURL=PromiseAPI.js.map