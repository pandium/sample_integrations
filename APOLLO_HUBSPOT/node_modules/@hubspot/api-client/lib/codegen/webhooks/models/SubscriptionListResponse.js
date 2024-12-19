"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionListResponse = void 0;
class SubscriptionListResponse {
    static getAttributeTypeMap() {
        return SubscriptionListResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriptionListResponse = SubscriptionListResponse;
SubscriptionListResponse.discriminator = undefined;
SubscriptionListResponse.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SubscriptionResponse>",
        "format": ""
    }
];
//# sourceMappingURL=SubscriptionListResponse.js.map