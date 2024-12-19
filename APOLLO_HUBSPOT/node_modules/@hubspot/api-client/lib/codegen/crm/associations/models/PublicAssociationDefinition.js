"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAssociationDefinition = void 0;
class PublicAssociationDefinition {
    static getAttributeTypeMap() {
        return PublicAssociationDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAssociationDefinition = PublicAssociationDefinition;
PublicAssociationDefinition.discriminator = undefined;
PublicAssociationDefinition.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
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
//# sourceMappingURL=PublicAssociationDefinition.js.map