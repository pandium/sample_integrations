"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputMarketingEventEmailSubscriber = void 0;
class BatchInputMarketingEventEmailSubscriber {
    static getAttributeTypeMap() {
        return BatchInputMarketingEventEmailSubscriber.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputMarketingEventEmailSubscriber = BatchInputMarketingEventEmailSubscriber;
BatchInputMarketingEventEmailSubscriber.discriminator = undefined;
BatchInputMarketingEventEmailSubscriber.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<MarketingEventEmailSubscriber>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputMarketingEventEmailSubscriber.js.map