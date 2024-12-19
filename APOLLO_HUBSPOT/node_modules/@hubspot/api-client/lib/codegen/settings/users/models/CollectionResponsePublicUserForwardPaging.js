"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicUserForwardPaging = void 0;
class CollectionResponsePublicUserForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicUserForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicUserForwardPaging = CollectionResponsePublicUserForwardPaging;
CollectionResponsePublicUserForwardPaging.discriminator = undefined;
CollectionResponsePublicUserForwardPaging.attributeTypeMap = [
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicUser>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicUserForwardPaging.js.map