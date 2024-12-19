"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicOwnerForwardPaging = void 0;
class CollectionResponsePublicOwnerForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicOwnerForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicOwnerForwardPaging = CollectionResponsePublicOwnerForwardPaging;
CollectionResponsePublicOwnerForwardPaging.discriminator = undefined;
CollectionResponsePublicOwnerForwardPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicOwner>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicOwnerForwardPaging.js.map