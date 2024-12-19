"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseAssociatedId = void 0;
class CollectionResponseAssociatedId {
    static getAttributeTypeMap() {
        return CollectionResponseAssociatedId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseAssociatedId = CollectionResponseAssociatedId;
CollectionResponseAssociatedId.discriminator = undefined;
CollectionResponseAssociatedId.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<AssociatedId>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseAssociatedId.js.map