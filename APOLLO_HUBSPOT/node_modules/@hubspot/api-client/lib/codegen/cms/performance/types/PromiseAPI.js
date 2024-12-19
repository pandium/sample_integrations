"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisePublicPerformanceApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromisePublicPerformanceApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePublicPerformanceApi(configuration, requestFactory, responseProcessor);
    }
    getPage(domain, path, pad, sum, period, interval, start, end, _options) {
        const result = this.api.getPage(domain, path, pad, sum, period, interval, start, end, _options);
        return result.toPromise();
    }
    getUptime(domain, path, pad, sum, period, interval, start, end, _options) {
        const result = this.api.getUptime(domain, path, pad, sum, period, interval, start, end, _options);
        return result.toPromise();
    }
}
exports.PromisePublicPerformanceApi = PromisePublicPerformanceApi;
//# sourceMappingURL=PromiseAPI.js.map