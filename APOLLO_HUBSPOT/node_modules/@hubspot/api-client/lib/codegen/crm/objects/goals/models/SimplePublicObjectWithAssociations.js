"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePublicObjectWithAssociations = void 0;
class SimplePublicObjectWithAssociations {
    static getAttributeTypeMap() {
        return SimplePublicObjectWithAssociations.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SimplePublicObjectWithAssociations = SimplePublicObjectWithAssociations;
SimplePublicObjectWithAssociations.discriminator = undefined;
SimplePublicObjectWithAssociations.attributeTypeMap = [
    {
        "name": "associations",
        "baseName": "associations",
        "type": "{ [key: string]: CollectionResponseAssociatedId; }",
        "format": ""
    },
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
//# sourceMappingURL=SimplePublicObjectWithAssociations.js.map