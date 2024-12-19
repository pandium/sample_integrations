"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
class Folder {
    static getAttributeTypeMap() {
        return Folder.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Folder = Folder;
Folder.discriminator = undefined;
Folder.attributeTypeMap = [
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
        "name": "archivedAt",
        "baseName": "archivedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "parentFolderId",
        "baseName": "parentFolderId",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "path",
        "baseName": "path",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=Folder.js.map