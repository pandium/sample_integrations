"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseSubscriptionResponse = void 0;
class BatchResponseSubscriptionResponse {
    static getAttributeTypeMap() {
        return BatchResponseSubscriptionResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseSubscriptionResponse = BatchResponseSubscriptionResponse;
BatchResponseSubscriptionResponse.discriminator = undefined;
BatchResponseSubscriptionResponse.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseSubscriptionResponseStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SubscriptionResponse>",
        "format": ""
    },
    {
        "name": "requestedAt",
        "baseName": "requestedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "startedAt",
        "baseName": "startedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "completedAt",
        "baseName": "completedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "links",
        "baseName": "links",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=BatchResponseSubscriptionResponse.js.map