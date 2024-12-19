"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisePublicObjectSchemasApi = exports.PromiseCoreApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseCoreApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCoreApi(configuration, requestFactory, responseProcessor);
    }
    archive(objectType, archived, _options) {
        const result = this.api.archive(objectType, archived, _options);
        return result.toPromise();
    }
    archiveAssociation(objectType, associationIdentifier, _options) {
        const result = this.api.archiveAssociation(objectType, associationIdentifier, _options);
        return result.toPromise();
    }
    create(objectSchemaEgg, _options) {
        const result = this.api.create(objectSchemaEgg, _options);
        return result.toPromise();
    }
    createAssociation(objectType, associationDefinitionEgg, _options) {
        const result = this.api.createAssociation(objectType, associationDefinitionEgg, _options);
        return result.toPromise();
    }
    getAll(archived, _options) {
        const result = this.api.getAll(archived, _options);
        return result.toPromise();
    }
    getById(objectType, _options) {
        const result = this.api.getById(objectType, _options);
        return result.toPromise();
    }
    update(objectType, objectTypeDefinitionPatch, _options) {
        const result = this.api.update(objectType, objectTypeDefinitionPatch, _options);
        return result.toPromise();
    }
}
exports.PromiseCoreApi = PromiseCoreApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromisePublicObjectSchemasApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservablePublicObjectSchemasApi(configuration, requestFactory, responseProcessor);
    }
    purge(objectType, _options) {
        const result = this.api.purge(objectType, _options);
        return result.toPromise();
    }
}
exports.PromisePublicObjectSchemasApi = PromisePublicObjectSchemasApi;
//# sourceMappingURL=PromiseAPI.js.map