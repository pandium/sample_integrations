"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicImportError = void 0;
class PublicImportError {
    static getAttributeTypeMap() {
        return PublicImportError.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicImportError = PublicImportError;
PublicImportError.discriminator = undefined;
PublicImportError.attributeTypeMap = [
    {
        "name": "errorType",
        "baseName": "errorType",
        "type": "PublicImportErrorErrorTypeEnum",
        "format": ""
    },
    {
        "name": "sourceData",
        "baseName": "sourceData",
        "type": "ImportRowCore",
        "format": ""
    },
    {
        "name": "objectType",
        "baseName": "objectType",
        "type": "PublicImportErrorObjectTypeEnum",
        "format": ""
    },
    {
        "name": "invalidValue",
        "baseName": "invalidValue",
        "type": "string",
        "format": ""
    },
    {
        "name": "extraContext",
        "baseName": "extraContext",
        "type": "string",
        "format": ""
    },
    {
        "name": "objectTypeId",
        "baseName": "objectTypeId",
        "type": "string",
        "format": ""
    },
    {
        "name": "knownColumnNumber",
        "baseName": "knownColumnNumber",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicImportError.js.map