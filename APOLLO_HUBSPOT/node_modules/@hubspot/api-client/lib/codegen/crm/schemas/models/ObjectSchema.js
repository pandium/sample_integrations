"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSchema = void 0;
class ObjectSchema {
    static getAttributeTypeMap() {
        return ObjectSchema.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ObjectSchema = ObjectSchema;
ObjectSchema.discriminator = undefined;
ObjectSchema.attributeTypeMap = [
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
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "fullyQualifiedName",
        "baseName": "fullyQualifiedName",
        "type": "string",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "objectTypeId",
        "baseName": "objectTypeId",
        "type": "string",
        "format": ""
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "Array<Property>",
        "format": ""
    },
    {
        "name": "associations",
        "baseName": "associations",
        "type": "Array<AssociationDefinition>",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ObjectSchema.js.map