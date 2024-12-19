"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservablePublicPerformanceApi = void 0;
const rxjsStub_1 = require("../rxjsStub");
const rxjsStub_2 = require("../rxjsStub");
const PublicPerformanceApi_1 = require("../apis/PublicPerformanceApi");
class ObservablePublicPerformanceApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new PublicPerformanceApi_1.PublicPerformanceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new PublicPerformanceApi_1.PublicPerformanceApiResponseProcessor();
    }
    getPage(domain, path, pad, sum, period, interval, start, end, _options) {
        const requestContextPromise = this.requestFactory.getPage(domain, path, pad, sum, period, interval, start, end, _options);
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
            return middlewarePostObservable.pipe((0, rxjsStub_2.map)((rsp) => this.responseProcessor.getPage(rsp)));
        }));
    }
    getUptime(domain, path, pad, sum, period, interval, start, end, _options) {
        const requestContextPromise = this.requestFactory.getUptime(domain, path, pad, sum, period, interval, start, end, _options);
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
            return middlewarePostObservable.pipe((0, rxjsStub_2.map)((rsp) => this.responseProcessor.getUptime(rsp)));
        }));
    }
}
exports.ObservablePublicPerformanceApi = ObservablePublicPerformanceApi;
//# sourceMappingURL=ObservableAPI.js.map