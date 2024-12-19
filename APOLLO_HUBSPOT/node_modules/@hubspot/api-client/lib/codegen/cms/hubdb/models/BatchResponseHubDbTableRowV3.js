"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseHubDbTableRowV3 = void 0;
class BatchResponseHubDbTableRowV3 {
    static getAttributeTypeMap() {
        return BatchResponseHubDbTableRowV3.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseHubDbTableRowV3 = BatchResponseHubDbTableRowV3;
BatchResponseHubDbTableRowV3.discriminator = undefined;
BatchResponseHubDbTableRowV3.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseHubDbTableRowV3StatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<HubDbTableRowV3>",
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
//# sourceMappingURL=BatchResponseHubDbTableRowV3.js.map