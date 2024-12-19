"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderActionResponse = void 0;
class FolderActionResponse {
    static getAttributeTypeMap() {
        return FolderActionResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FolderActionResponse = FolderActionResponse;
FolderActionResponse.discriminator = undefined;
FolderActionResponse.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "FolderActionResponseStatusEnum",
        "format": ""
    },
    {
        "name": "result",
        "baseName": "result",
        "type": "Folder",
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
//# sourceMappingURL=FolderActionResponse.js.map