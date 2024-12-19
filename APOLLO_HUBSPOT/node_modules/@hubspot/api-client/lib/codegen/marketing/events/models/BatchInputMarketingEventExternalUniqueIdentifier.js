"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputMarketingEventExternalUniqueIdentifier = void 0;
class BatchInputMarketingEventExternalUniqueIdentifier {
    static getAttributeTypeMap() {
        return BatchInputMarketingEventExternalUniqueIdentifier.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputMarketingEventExternalUniqueIdentifier = BatchInputMarketingEventExternalUniqueIdentifier;
BatchInputMarketingEventExternalUniqueIdentifier.discriminator = undefined;
BatchInputMarketingEventExternalUniqueIdentifier.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<MarketingEventExternalUniqueIdentifier>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputMarketingEventExternalUniqueIdentifier.js.map