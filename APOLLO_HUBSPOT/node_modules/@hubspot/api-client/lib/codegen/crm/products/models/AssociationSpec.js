"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationSpec = void 0;
class AssociationSpec {
    static getAttributeTypeMap() {
        return AssociationSpec.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AssociationSpec = AssociationSpec;
AssociationSpec.discriminator = undefined;
AssociationSpec.attributeTypeMap = [
    {
        "name": "associationCategory",
        "baseName": "associationCategory",
        "type": "AssociationSpecAssociationCategoryEnum",
        "format": ""
    },
    {
        "name": "associationTypeId",
        "baseName": "associationTypeId",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=AssociationSpec.js.map