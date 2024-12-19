"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCreateRequest = void 0;
class SubscriptionCreateRequest {
    static getAttributeTypeMap() {
        return SubscriptionCreateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriptionCreateRequest = SubscriptionCreateRequest;
SubscriptionCreateRequest.discriminator = undefined;
SubscriptionCreateRequest.attributeTypeMap = [
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "SubscriptionCreateRequestEventTypeEnum",
        "format": ""
    },
    {
        "name": "propertyName",
        "baseName": "propertyName",
        "type": "string",
        "format": ""
    },
    {
        "name": "active",
        "baseName": "active",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=SubscriptionCreateRequest.js.map