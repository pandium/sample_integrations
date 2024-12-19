"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionPage = void 0;
class VersionPage {
    static getAttributeTypeMap() {
        return VersionPage.attributeTypeMap;
    }
    constructor() {
    }
}
exports.VersionPage = VersionPage;
VersionPage.discriminator = undefined;
VersionPage.attributeTypeMap = [
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
        "type": "Page",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=VersionPage.js.map