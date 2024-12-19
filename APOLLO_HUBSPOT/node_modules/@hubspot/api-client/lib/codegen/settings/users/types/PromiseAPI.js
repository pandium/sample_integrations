"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseUsersApi = exports.PromiseTeamsApi = exports.PromiseRolesApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseRolesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableRolesApi(configuration, requestFactory, responseProcessor);
    }
    getAll(_options) {
        const result = this.api.getAll(_options);
        return result.toPromise();
    }
}
exports.PromiseRolesApi = PromiseRolesApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromiseTeamsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableTeamsApi(configuration, requestFactory, responseProcessor);
    }
    getAll(_options) {
        const result = this.api.getAll(_options);
        return result.toPromise();
    }
}
exports.PromiseTeamsApi = PromiseTeamsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class PromiseUsersApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }
    archive(userId, idProperty, _options) {
        const result = this.api.archive(userId, idProperty, _options);
        return result.toPromise();
    }
    create(userProvisionRequest, _options) {
        const result = this.api.create(userProvisionRequest, _options);
        return result.toPromise();
    }
    getById(userId, idProperty, _options) {
        const result = this.api.getById(userId, idProperty, _options);
        return result.toPromise();
    }
    getPage(limit, after, _options) {
        const result = this.api.getPage(limit, after, _options);
        return result.toPromise();
    }
    replace(userId, publicUserUpdate, idProperty, _options) {
        const result = this.api.replace(userId, publicUserUpdate, idProperty, _options);
        return result.toPromise();
    }
}
exports.PromiseUsersApi = PromiseUsersApi;
//# sourceMappingURL=PromiseAPI.js.map