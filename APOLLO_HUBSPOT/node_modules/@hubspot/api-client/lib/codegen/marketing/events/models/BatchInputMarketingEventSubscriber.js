"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputMarketingEventSubscriber = void 0;
class BatchInputMarketingEventSubscriber {
    static getAttributeTypeMap() {
        return BatchInputMarketingEventSubscriber.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputMarketingEventSubscriber = BatchInputMarketingEventSubscriber;
BatchInputMarketingEventSubscriber.discriminator = undefined;
BatchInputMarketingEventSubscriber.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<MarketingEventSubscriber>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputMarketingEventSubscriber.js.map