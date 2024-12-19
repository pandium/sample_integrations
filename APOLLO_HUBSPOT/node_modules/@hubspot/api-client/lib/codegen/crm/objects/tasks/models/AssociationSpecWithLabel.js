"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationSpecWithLabel = void 0;
class AssociationSpecWithLabel {
    static getAttributeTypeMap() {
        return AssociationSpecWithLabel.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AssociationSpecWithLabel = AssociationSpecWithLabel;
AssociationSpecWithLabel.discriminator = undefined;
AssociationSpecWithLabel.attributeTypeMap = [
    {
        "name": "category",
        "baseName": "category",
        "type": "AssociationSpecWithLabelCategoryEnum",
        "format": ""
    },
    {
        "name": "typeId",
        "baseName": "typeId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=AssociationSpecWithLabel.js.map