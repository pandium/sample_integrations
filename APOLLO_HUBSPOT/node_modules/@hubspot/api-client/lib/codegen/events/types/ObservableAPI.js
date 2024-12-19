"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableEventsApi = void 0;
const rxjsStub_1 = require("../rxjsStub");
const rxjsStub_2 = require("../rxjsStub");
const EventsApi_1 = require("../apis/EventsApi");
class ObservableEventsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new EventsApi_1.EventsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new EventsApi_1.EventsApiResponseProcessor();
    }
    getPage(occurredAfter, occurredBefore, objectType, objectId, eventType, after, before, limit, sort, _options) {
        const requestContextPromise = this.requestFactory.getPage(occurredAfter, occurredBefore, objectType, objectId, eventType, after, before, limit, sort, _options);
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
}
exports.ObservableEventsApi = ObservableEventsApi;
//# sourceMappingURL=ObservableAPI.js.map