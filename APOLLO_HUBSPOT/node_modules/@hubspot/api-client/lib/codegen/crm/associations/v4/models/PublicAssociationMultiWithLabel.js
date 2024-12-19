"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAssociationMultiWithLabel = void 0;
class PublicAssociationMultiWithLabel {
    static getAttributeTypeMap() {
        return PublicAssociationMultiWithLabel.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAssociationMultiWithLabel = PublicAssociationMultiWithLabel;
PublicAssociationMultiWithLabel.discriminator = undefined;
PublicAssociationMultiWithLabel.attributeTypeMap = [
    {
        "name": "_from",
        "baseName": "from",
        "type": "PublicObjectId",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    },
    {
        "name": "to",
        "baseName": "to",
        "type": "Array<MultiAssociatedObjectWithLabel>",
        "format": ""
    }
];
//# sourceMappingURL=PublicAssociationMultiWithLabel.js.map