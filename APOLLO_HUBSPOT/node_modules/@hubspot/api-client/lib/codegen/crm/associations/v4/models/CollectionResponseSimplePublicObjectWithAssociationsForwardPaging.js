"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseSimplePublicObjectWithAssociationsForwardPaging = void 0;
class CollectionResponseSimplePublicObjectWithAssociationsForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseSimplePublicObjectWithAssociationsForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseSimplePublicObjectWithAssociationsForwardPaging = CollectionResponseSimplePublicObjectWithAssociationsForwardPaging;
CollectionResponseSimplePublicObjectWithAssociationsForwardPaging.discriminator = undefined;
CollectionResponseSimplePublicObjectWithAssociationsForwardPaging.attributeTypeMap = [
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SimplePublicObjectWithAssociations>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseSimplePublicObjectWithAssociationsForwardPaging.js.map