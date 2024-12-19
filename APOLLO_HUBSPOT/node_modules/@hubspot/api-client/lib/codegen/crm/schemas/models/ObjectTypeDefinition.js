"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeDefinition = void 0;
class ObjectTypeDefinition {
    static getAttributeTypeMap() {
        return ObjectTypeDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ObjectTypeDefinition = ObjectTypeDefinition;
ObjectTypeDefinition.discriminator = undefined;
ObjectTypeDefinition.attributeTypeMap = [
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
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "portalId",
        "baseName": "portalId",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=ObjectTypeDefinition.js.map