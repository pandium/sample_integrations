"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseAssociatedIdForwardPaging = void 0;
class CollectionResponseAssociatedIdForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseAssociatedIdForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseAssociatedIdForwardPaging = CollectionResponseAssociatedIdForwardPaging;
CollectionResponseAssociatedIdForwardPaging.discriminator = undefined;
CollectionResponseAssociatedIdForwardPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<AssociatedId>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseAssociatedIdForwardPaging.js.map