"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseTagWithErrors = void 0;
class BatchResponseTagWithErrors {
    static getAttributeTypeMap() {
        return BatchResponseTagWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseTagWithErrors = BatchResponseTagWithErrors;
BatchResponseTagWithErrors.discriminator = undefined;
BatchResponseTagWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseTagWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Tag>",
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
//# sourceMappingURL=BatchResponseTagWithErrors.js.map