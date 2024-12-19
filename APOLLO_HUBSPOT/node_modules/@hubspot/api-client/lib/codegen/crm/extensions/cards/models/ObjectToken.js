"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectToken = void 0;
class ObjectToken {
    static getAttributeTypeMap() {
        return ObjectToken.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ObjectToken = ObjectToken;
ObjectToken.discriminator = undefined;
ObjectToken.attributeTypeMap = [
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
        "name": "dataType",
        "baseName": "dataType",
        "type": "ObjectTokenDataTypeEnum",
        "format": ""
    },
    {
        "name": "value",
        "baseName": "value",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ObjectToken.js.map