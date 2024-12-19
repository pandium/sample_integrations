"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSchemaEgg = void 0;
class ObjectSchemaEgg {
    static getAttributeTypeMap() {
        return ObjectSchemaEgg.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ObjectSchemaEgg = ObjectSchemaEgg;
ObjectSchemaEgg.discriminator = undefined;
ObjectSchemaEgg.attributeTypeMap = [
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
        "name": "properties",
        "baseName": "properties",
        "type": "Array<ObjectTypePropertyCreate>",
        "format": ""
    },
    {
        "name": "associatedObjects",
        "baseName": "associatedObjects",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ObjectSchemaEgg.js.map