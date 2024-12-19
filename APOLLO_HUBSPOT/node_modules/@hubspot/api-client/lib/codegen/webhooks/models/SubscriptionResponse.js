"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionResponse = void 0;
class SubscriptionResponse {
    static getAttributeTypeMap() {
        return SubscriptionResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriptionResponse = SubscriptionResponse;
SubscriptionResponse.discriminator = undefined;
SubscriptionResponse.attributeTypeMap = [
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "SubscriptionResponseEventTypeEnum",
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
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=SubscriptionResponse.js.map