"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableGenerateApi = void 0;
const rxjsStub_1 = require("../rxjsStub");
const rxjsStub_2 = require("../rxjsStub");
const GenerateApi_1 = require("../apis/GenerateApi");
class ObservableGenerateApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new GenerateApi_1.GenerateApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new GenerateApi_1.GenerateApiResponseProcessor();
    }
    generateToken(identificationTokenGenerationRequest, _options) {
        const requestContextPromise = this.requestFactory.generateToken(identificationTokenGenerationRequest, _options);
        let middlewarePreObservable = (0, rxjsStub_1.from)(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe((0, rxjsStub_2.mergeMap)((ctx) => middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe((0, rxjsStub_2.mergeMap)((ctx) => this.configuration.httpApi.send(ctx))).
            pipe((0, rxjsStub_2.mergeMap)((response) => {
            let middlewarePostObservable = (0, rxjsStub_1.of)(response);
            for (let middleware of this.configuration.middleware) {
                middlewarePostObservable = middlewarePostObservable.pipe((0, rxjsStub_2.mergeMap)((rsp) => middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe((0, rxjsStub_2.map)((rsp) => this.responseProcessor.generateToken(rsp)));
        }));
    }
}
exports.ObservableGenerateApi = ObservableGenerateApi;
//# sourceMappingURL=ObservableAPI.js.map