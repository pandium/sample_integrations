"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUsersApi = exports.ObjectTeamsApi = exports.ObjectRolesApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectRolesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableRolesApi(configuration, requestFactory, responseProcessor);
    }
    getAll(param = {}, options) {
        return this.api.getAll(options).toPromise();
    }
}
exports.ObjectRolesApi = ObjectRolesApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectTeamsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableTeamsApi(configuration, requestFactory, responseProcessor);
    }
    getAll(param = {}, options) {
        return this.api.getAll(options).toPromise();
    }
}
exports.ObjectTeamsApi = ObjectTeamsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectUsersApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.userId, param.idProperty, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.userProvisionRequest, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.userId, param.idProperty, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.limit, param.after, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.userId, param.publicUserUpdate, param.idProperty, options).toPromise();
    }
}
exports.ObjectUsersApi = ObjectUsersApi;
//# sourceMappingURL=ObjectParamAPI.js.map