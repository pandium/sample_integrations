"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionInput = void 0;
class OptionInput {
    static getAttributeTypeMap() {
        return OptionInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.OptionInput = OptionInput;
OptionInput.discriminator = undefined;
OptionInput.attributeTypeMap = [
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "value",
        "baseName": "value",
        "type": "string",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
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
        "name": "hidden",
        "baseName": "hidden",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=OptionInput.js.map