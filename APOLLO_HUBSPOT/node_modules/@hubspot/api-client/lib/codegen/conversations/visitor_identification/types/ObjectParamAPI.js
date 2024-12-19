"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectGenerateApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectGenerateApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableGenerateApi(configuration, requestFactory, responseProcessor);
    }
    generateToken(param, options) {
        return this.api.generateToken(param.identificationTokenGenerationRequest, options).toPromise();
    }
}
exports.ObjectGenerateApi = ObjectGenerateApi;
//# sourceMappingURL=ObjectParamAPI.js.map