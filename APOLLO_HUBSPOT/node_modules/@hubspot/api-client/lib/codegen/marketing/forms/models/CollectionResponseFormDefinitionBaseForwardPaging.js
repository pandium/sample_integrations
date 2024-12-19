"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseFormDefinitionBaseForwardPaging = void 0;
class CollectionResponseFormDefinitionBaseForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseFormDefinitionBaseForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseFormDefinitionBaseForwardPaging = CollectionResponseFormDefinitionBaseForwardPaging;
CollectionResponseFormDefinitionBaseForwardPaging.discriminator = undefined;
CollectionResponseFormDefinitionBaseForwardPaging.attributeTypeMap = [
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<CollectionResponseFormDefinitionBaseForwardPagingResultsInner>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseFormDefinitionBaseForwardPaging.js.map