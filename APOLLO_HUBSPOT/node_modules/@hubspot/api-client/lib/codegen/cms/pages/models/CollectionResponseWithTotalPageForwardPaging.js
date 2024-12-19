"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalPageForwardPaging = void 0;
class CollectionResponseWithTotalPageForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalPageForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalPageForwardPaging = CollectionResponseWithTotalPageForwardPaging;
CollectionResponseWithTotalPageForwardPaging.discriminator = undefined;
CollectionResponseWithTotalPageForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Page>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalPageForwardPaging.js.map