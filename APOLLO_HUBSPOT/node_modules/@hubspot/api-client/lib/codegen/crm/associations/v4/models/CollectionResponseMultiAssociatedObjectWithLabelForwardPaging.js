"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseMultiAssociatedObjectWithLabelForwardPaging = void 0;
class CollectionResponseMultiAssociatedObjectWithLabelForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseMultiAssociatedObjectWithLabelForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseMultiAssociatedObjectWithLabelForwardPaging = CollectionResponseMultiAssociatedObjectWithLabelForwardPaging;
CollectionResponseMultiAssociatedObjectWithLabelForwardPaging.discriminator = undefined;
CollectionResponseMultiAssociatedObjectWithLabelForwardPaging.attributeTypeMap = [
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<MultiAssociatedObjectWithLabel>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseMultiAssociatedObjectWithLabelForwardPaging.js.map