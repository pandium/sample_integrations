"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicBusinessUnitLogoMetadata = void 0;
class PublicBusinessUnitLogoMetadata {
    static getAttributeTypeMap() {
        return PublicBusinessUnitLogoMetadata.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicBusinessUnitLogoMetadata = PublicBusinessUnitLogoMetadata;
PublicBusinessUnitLogoMetadata.discriminator = undefined;
PublicBusinessUnitLogoMetadata.attributeTypeMap = [
    {
        "name": "logoAltText",
        "baseName": "logoAltText",
        "type": "string",
        "format": ""
    },
    {
        "name": "resizedUrl",
        "baseName": "resizedUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "logoUrl",
        "baseName": "logoUrl",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicBusinessUnitLogoMetadata.js.map