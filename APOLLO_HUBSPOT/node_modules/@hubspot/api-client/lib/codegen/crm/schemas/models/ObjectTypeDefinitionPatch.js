"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeDefinitionPatch = void 0;
class ObjectTypeDefinitionPatch {
    static getAttributeTypeMap() {
        return ObjectTypeDefinitionPatch.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ObjectTypeDefinitionPatch = ObjectTypeDefinitionPatch;
ObjectTypeDefinitionPatch.discriminator = undefined;
ObjectTypeDefinitionPatch.attributeTypeMap = [
    {
        "name": "labels",
        "baseName": "labels",
        "type": "ObjectTypeDefinitionLabels",
        "format": ""
    },
    {
        "name": "requiredProperties",
        "baseName": "requiredProperties",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "searchableProperties",
        "baseName": "searchableProperties",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "primaryDisplayProperty",
        "baseName": "primaryDisplayProperty",
        "type": "string",
        "format": ""
    },
    {
        "name": "secondaryDisplayProperties",
        "baseName": "secondaryDisplayProperties",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "restorable",
        "baseName": "restorable",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=ObjectTypeDefinitionPatch.js.map