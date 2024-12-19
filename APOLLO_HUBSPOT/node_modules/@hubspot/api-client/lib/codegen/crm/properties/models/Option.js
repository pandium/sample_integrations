"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = void 0;
class Option {
    static getAttributeTypeMap() {
        return Option.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Option = Option;
Option.discriminator = undefined;
Option.attributeTypeMap = [
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
//# sourceMappingURL=Option.js.map