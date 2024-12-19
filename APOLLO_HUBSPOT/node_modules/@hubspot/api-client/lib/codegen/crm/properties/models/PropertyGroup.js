"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyGroup = void 0;
class PropertyGroup {
    static getAttributeTypeMap() {
        return PropertyGroup.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PropertyGroup = PropertyGroup;
PropertyGroup.discriminator = undefined;
PropertyGroup.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "displayOrder",
        "baseName": "displayOrder",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=PropertyGroup.js.map