"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSubscriptionStatusesResponse = void 0;
class PublicSubscriptionStatusesResponse {
    static getAttributeTypeMap() {
        return PublicSubscriptionStatusesResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicSubscriptionStatusesResponse = PublicSubscriptionStatusesResponse;
PublicSubscriptionStatusesResponse.discriminator = undefined;
PublicSubscriptionStatusesResponse.attributeTypeMap = [
    {
        "name": "recipient",
        "baseName": "recipient",
        "type": "string",
        "format": ""
    },
    {
        "name": "subscriptionStatuses",
        "baseName": "subscriptionStatuses",
        "type": "Array<PublicSubscriptionStatus>",
        "format": ""
    }
];
//# sourceMappingURL=PublicSubscriptionStatusesResponse.js.map