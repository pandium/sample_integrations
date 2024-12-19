"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationDefinitionEgg = void 0;
class AssociationDefinitionEgg {
    static getAttributeTypeMap() {
        return AssociationDefinitionEgg.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AssociationDefinitionEgg = AssociationDefinitionEgg;
AssociationDefinitionEgg.discriminator = undefined;
AssociationDefinitionEgg.attributeTypeMap = [
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
    }
];
//# sourceMappingURL=AssociationDefinitionEgg.js.map