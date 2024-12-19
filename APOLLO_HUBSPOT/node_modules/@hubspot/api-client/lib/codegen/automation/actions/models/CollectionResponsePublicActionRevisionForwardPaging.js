"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicActionRevisionForwardPaging = void 0;
class CollectionResponsePublicActionRevisionForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicActionRevisionForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicActionRevisionForwardPaging = CollectionResponsePublicActionRevisionForwardPaging;
CollectionResponsePublicActionRevisionForwardPaging.discriminator = undefined;
CollectionResponsePublicActionRevisionForwardPaging.attributeTypeMap = [
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicActionRevision>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicActionRevisionForwardPaging.js.map