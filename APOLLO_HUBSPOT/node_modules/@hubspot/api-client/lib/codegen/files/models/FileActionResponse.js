"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileActionResponse = void 0;
class FileActionResponse {
    static getAttributeTypeMap() {
        return FileActionResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FileActionResponse = FileActionResponse;
FileActionResponse.discriminator = undefined;
FileActionResponse.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "FileActionResponseStatusEnum",
        "format": ""
    },
    {
        "name": "result",
        "baseName": "result",
        "type": "any",
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
    },
    {
        "name": "taskId",
        "baseName": "taskId",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=FileActionResponse.js.map