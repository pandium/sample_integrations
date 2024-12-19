"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldTypeDefinition = void 0;
class FieldTypeDefinition {
    static getAttributeTypeMap() {
        return FieldTypeDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FieldTypeDefinition = FieldTypeDefinition;
FieldTypeDefinition.discriminator = undefined;
FieldTypeDefinition.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "FieldTypeDefinitionTypeEnum",
        "format": ""
    },
    {
        "name": "fieldType",
        "baseName": "fieldType",
        "type": "FieldTypeDefinitionFieldTypeEnum",
        "format": ""
    },
    {
        "name": "options",
        "baseName": "options",
        "type": "Array<Option>",
        "format": ""
    },
    {
        "name": "optionsUrl",
        "baseName": "optionsUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "referencedObjectType",
        "baseName": "referencedObjectType",
        "type": "FieldTypeDefinitionReferencedObjectTypeEnum",
        "format": ""
    }
];
//# sourceMappingURL=FieldTypeDefinition.js.map