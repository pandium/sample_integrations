"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputMarketingEventCreateRequestParams = void 0;
class BatchInputMarketingEventCreateRequestParams {
    static getAttributeTypeMap() {
        return BatchInputMarketingEventCreateRequestParams.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputMarketingEventCreateRequestParams = BatchInputMarketingEventCreateRequestParams;
BatchInputMarketingEventCreateRequestParams.discriminator = undefined;
BatchInputMarketingEventCreateRequestParams.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<MarketingEventCreateRequestParams>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputMarketingEventCreateRequestParams.js.map