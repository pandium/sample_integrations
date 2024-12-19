"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyGroupUpdate = void 0;
class PropertyGroupUpdate {
    static getAttributeTypeMap() {
        return PropertyGroupUpdate.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PropertyGroupUpdate = PropertyGroupUpdate;
PropertyGroupUpdate.discriminator = undefined;
PropertyGroupUpdate.attributeTypeMap = [
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
//# sourceMappingURL=PropertyGroupUpdate.js.map