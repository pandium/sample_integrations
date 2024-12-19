"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseSimplePublicObjectWithErrors = void 0;
class BatchResponseSimplePublicObjectWithErrors {
    static getAttributeTypeMap() {
        return BatchResponseSimplePublicObjectWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseSimplePublicObjectWithErrors = BatchResponseSimplePublicObjectWithErrors;
BatchResponseSimplePublicObjectWithErrors.discriminator = undefined;
BatchResponseSimplePublicObjectWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseSimplePublicObjectWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SimplePublicObject>",
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
//# sourceMappingURL=BatchResponseSimplePublicObjectWithErrors.js.map