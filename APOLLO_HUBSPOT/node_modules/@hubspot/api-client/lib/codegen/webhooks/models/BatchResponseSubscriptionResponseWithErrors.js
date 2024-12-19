"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseSubscriptionResponseWithErrors = void 0;
class BatchResponseSubscriptionResponseWithErrors {
    static getAttributeTypeMap() {
        return BatchResponseSubscriptionResponseWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseSubscriptionResponseWithErrors = BatchResponseSubscriptionResponseWithErrors;
BatchResponseSubscriptionResponseWithErrors.discriminator = undefined;
BatchResponseSubscriptionResponseWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseSubscriptionResponseWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SubscriptionResponse>",
        "format": ""
    },
    {
        "name": "numErrors",
        "baseName": "numErrors",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "errors",
        "baseName": "errors",
        "type": "Array<StandardError>",
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
//# sourceMappingURL=BatchResponseSubscriptionResponseWithErrors.js.map