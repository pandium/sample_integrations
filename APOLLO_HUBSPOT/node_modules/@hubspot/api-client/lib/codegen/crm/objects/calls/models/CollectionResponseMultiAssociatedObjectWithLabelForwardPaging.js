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
        "name": "results",
        "baseName": "results",
        "type": "Array<MultiAssociatedObjectWithLabel>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseMultiAssociatedObjectWithLabelForwardPaging.js.map