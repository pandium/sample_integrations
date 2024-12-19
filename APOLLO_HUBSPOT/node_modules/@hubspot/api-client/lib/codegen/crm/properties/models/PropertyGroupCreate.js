"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyGroupCreate = void 0;
class PropertyGroupCreate {
    static getAttributeTypeMap() {
        return PropertyGroupCreate.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PropertyGroupCreate = PropertyGroupCreate;
PropertyGroupCreate.discriminator = undefined;
PropertyGroupCreate.attributeTypeMap = [
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
    }
];
//# sourceMappingURL=PropertyGroupCreate.js.map