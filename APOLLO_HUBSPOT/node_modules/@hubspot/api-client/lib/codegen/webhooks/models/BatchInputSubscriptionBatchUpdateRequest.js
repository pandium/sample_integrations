"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputSubscriptionBatchUpdateRequest = void 0;
class BatchInputSubscriptionBatchUpdateRequest {
    static getAttributeTypeMap() {
        return BatchInputSubscriptionBatchUpdateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputSubscriptionBatchUpdateRequest = BatchInputSubscriptionBatchUpdateRequest;
BatchInputSubscriptionBatchUpdateRequest.discriminator = undefined;
BatchInputSubscriptionBatchUpdateRequest.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<SubscriptionBatchUpdateRequest>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputSubscriptionBatchUpdateRequest.js.map