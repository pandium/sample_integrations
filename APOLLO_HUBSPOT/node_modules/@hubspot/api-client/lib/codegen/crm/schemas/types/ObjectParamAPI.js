"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPublicObjectSchemasApi = exports.ObjectCoreApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectCoreApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCoreApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.objectType, param.archived, options).toPromise();
    }
    archiveAssociation(param, options) {
        return this.api.archiveAssociation(param.objectType, param.associationIdentifier, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.objectSchemaEgg, options).toPromise();
    }
    createAssociation(param, options) {
        return this.api.createAssociation(param.objectType, param.associationDefinitionEgg, options).toPromise();
    }
    getAll(param = {}, options) {
        return this.api.getAll(param.archived, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectType, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectType, param.objectTypeDefinitionPatch, options).toPromise();
    }
}
exports.ObjectCoreApi = ObjectCoreApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectPublicObjectSchemasApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservablePublicObjectSchemasApi(configuration, requestFactory, responseProcessor);
    }
    purge(param, options) {
        return this.api.purge(param.objectType, options).toPromise();
    }
}
exports.ObjectPublicObjectSchemasApi = ObjectPublicObjectSchemasApi;
//# sourceMappingURL=ObjectParamAPI.js.map