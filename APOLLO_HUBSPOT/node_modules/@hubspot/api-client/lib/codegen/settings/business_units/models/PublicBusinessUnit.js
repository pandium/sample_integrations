"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicBusinessUnit = void 0;
class PublicBusinessUnit {
    static getAttributeTypeMap() {
        return PublicBusinessUnit.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicBusinessUnit = PublicBusinessUnit;
PublicBusinessUnit.discriminator = undefined;
PublicBusinessUnit.attributeTypeMap = [
    {
        "name": "logoMetadata",
        "baseName": "logoMetadata",
        "type": "PublicBusinessUnitLogoMetadata",
        "format": ""
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
    }
];
//# sourceMappingURL=PublicBusinessUnit.js.map