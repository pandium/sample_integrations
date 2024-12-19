"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypePropertyCreate = void 0;
class ObjectTypePropertyCreate {
    static getAttributeTypeMap() {
        return ObjectTypePropertyCreate.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ObjectTypePropertyCreate = ObjectTypePropertyCreate;
ObjectTypePropertyCreate.discriminator = undefined;
ObjectTypePropertyCreate.attributeTypeMap = [
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
        "name": "groupName",
        "baseName": "groupName",
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
        "name": "options",
        "baseName": "options",
        "type": "Array<OptionInput>",
        "format": ""
    },
    {
        "name": "displayOrder",
        "baseName": "displayOrder",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "hasUniqueValue",
        "baseName": "hasUniqueValue",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "hidden",
        "baseName": "hidden",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "ObjectTypePropertyCreateTypeEnum",
        "format": ""
    },
    {
        "name": "fieldType",
        "baseName": "fieldType",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ObjectTypePropertyCreate.js.map