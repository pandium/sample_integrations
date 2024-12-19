"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentFolder = void 0;
class ContentFolder {
    static getAttributeTypeMap() {
        return ContentFolder.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ContentFolder = ContentFolder;
ContentFolder.discriminator = undefined;
ContentFolder.attributeTypeMap = [
    {
        "name": "deletedAt",
        "baseName": "deletedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "parentFolderId",
        "baseName": "parentFolderId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "created",
        "baseName": "created",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "category",
        "baseName": "category",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "updated",
        "baseName": "updated",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=ContentFolder.js.map