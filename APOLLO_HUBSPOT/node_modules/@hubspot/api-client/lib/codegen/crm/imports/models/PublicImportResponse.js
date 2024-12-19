"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicImportResponse = void 0;
class PublicImportResponse {
    static getAttributeTypeMap() {
        return PublicImportResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicImportResponse = PublicImportResponse;
PublicImportResponse.discriminator = undefined;
PublicImportResponse.attributeTypeMap = [
    {
        "name": "state",
        "baseName": "state",
        "type": "PublicImportResponseStateEnum",
        "format": ""
    },
    {
        "name": "importRequestJson",
        "baseName": "importRequestJson",
        "type": "any",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "PublicImportMetadata",
        "format": ""
    },
    {
        "name": "importName",
        "baseName": "importName",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "optOutImport",
        "baseName": "optOutImport",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicImportResponse.js.map