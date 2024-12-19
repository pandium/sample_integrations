"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiAssociatedObjectWithLabel = void 0;
class MultiAssociatedObjectWithLabel {
    static getAttributeTypeMap() {
        return MultiAssociatedObjectWithLabel.attributeTypeMap;
    }
    constructor() {
    }
}
exports.MultiAssociatedObjectWithLabel = MultiAssociatedObjectWithLabel;
MultiAssociatedObjectWithLabel.discriminator = undefined;
MultiAssociatedObjectWithLabel.attributeTypeMap = [
    {
        "name": "toObjectId",
        "baseName": "toObjectId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "associationTypes",
        "baseName": "associationTypes",
        "type": "Array<AssociationSpecWithLabel>",
        "format": ""
    }
];
//# sourceMappingURL=MultiAssociatedObjectWithLabel.js.map