"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionRevision = void 0;
class PublicActionRevision {
    static getAttributeTypeMap() {
        return PublicActionRevision.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionRevision = PublicActionRevision;
PublicActionRevision.discriminator = undefined;
PublicActionRevision.attributeTypeMap = [
    {
        "name": "revisionId",
        "baseName": "revisionId",
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
        "name": "definition",
        "baseName": "definition",
        "type": "PublicActionDefinition",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicActionRevision.js.map