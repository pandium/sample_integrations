"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationDefinition = void 0;
class AssociationDefinition {
    static getAttributeTypeMap() {
        return AssociationDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AssociationDefinition = AssociationDefinition;
AssociationDefinition.discriminator = undefined;
AssociationDefinition.attributeTypeMap = [
    {
        "name": "fromObjectTypeId",
        "baseName": "fromObjectTypeId",
        "type": "string",
        "format": ""
    },
    {
        "name": "toObjectTypeId",
        "baseName": "toObjectTypeId",
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
        "name": "id",
        "baseName": "id",
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
    }
];
//# sourceMappingURL=AssociationDefinition.js.map