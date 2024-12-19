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
        "name": "results",
        "baseName": "results",
        "type": "Array<SimplePublicObjectWithAssociations>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseSimplePublicObjectWithAssociationsForwardPaging.js.map