"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionContentFolder = void 0;
class VersionContentFolder {
    static getAttributeTypeMap() {
        return VersionContentFolder.attributeTypeMap;
    }
    constructor() {
    }
}
exports.VersionContentFolder = VersionContentFolder;
VersionContentFolder.discriminator = undefined;
VersionContentFolder.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "user",
        "baseName": "user",
        "type": "VersionUser",
        "format": ""
    },
    {
        "name": "object",
        "baseName": "object",
        "type": "ContentFolder",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=VersionContentFolder.js.map