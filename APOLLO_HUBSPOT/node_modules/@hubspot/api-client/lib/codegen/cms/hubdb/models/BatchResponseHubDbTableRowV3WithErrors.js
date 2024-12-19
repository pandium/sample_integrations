"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseHubDbTableRowV3WithErrors = void 0;
class BatchResponseHubDbTableRowV3WithErrors {
    static getAttributeTypeMap() {
        return BatchResponseHubDbTableRowV3WithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseHubDbTableRowV3WithErrors = BatchResponseHubDbTableRowV3WithErrors;
BatchResponseHubDbTableRowV3WithErrors.discriminator = undefined;
BatchResponseHubDbTableRowV3WithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseHubDbTableRowV3WithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<HubDbTableRowV3>",
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
//# sourceMappingURL=BatchResponseHubDbTableRowV3WithErrors.js.map