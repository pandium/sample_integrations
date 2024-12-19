"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeDefinitionLabels = void 0;
class ObjectTypeDefinitionLabels {
    static getAttributeTypeMap() {
        return ObjectTypeDefinitionLabels.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ObjectTypeDefinitionLabels = ObjectTypeDefinitionLabels;
ObjectTypeDefinitionLabels.discriminator = undefined;
ObjectTypeDefinitionLabels.attributeTypeMap = [
    {
        "name": "singular",
        "baseName": "singular",
        "type": "string",
        "format": ""
    },
    {
        "name": "plural",
        "baseName": "plural",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ObjectTypeDefinitionLabels.js.map