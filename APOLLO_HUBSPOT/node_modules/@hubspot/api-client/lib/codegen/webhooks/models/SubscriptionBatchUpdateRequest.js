"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionBatchUpdateRequest = void 0;
class SubscriptionBatchUpdateRequest {
    static getAttributeTypeMap() {
        return SubscriptionBatchUpdateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriptionBatchUpdateRequest = SubscriptionBatchUpdateRequest;
SubscriptionBatchUpdateRequest.discriminator = undefined;
SubscriptionBatchUpdateRequest.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "active",
        "baseName": "active",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=SubscriptionBatchUpdateRequest.js.map