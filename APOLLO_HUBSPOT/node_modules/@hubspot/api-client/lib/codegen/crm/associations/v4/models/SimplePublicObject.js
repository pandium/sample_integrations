"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePublicObject = void 0;
class SimplePublicObject {
    static getAttributeTypeMap() {
        return SimplePublicObject.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SimplePublicObject = SimplePublicObject;
SimplePublicObject.discriminator = undefined;
SimplePublicObject.attributeTypeMap = [
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "archivedAt",
        "baseName": "archivedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "propertiesWithHistory",
        "baseName": "propertiesWithHistory",
        "type": "{ [key: string]: Array<ValueWithTimestamp>; }",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string | null; }",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=SimplePublicObject.js.map