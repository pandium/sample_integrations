"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalContentFolderForwardPaging = void 0;
class CollectionResponseWithTotalContentFolderForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalContentFolderForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalContentFolderForwardPaging = CollectionResponseWithTotalContentFolderForwardPaging;
CollectionResponseWithTotalContentFolderForwardPaging.discriminator = undefined;
CollectionResponseWithTotalContentFolderForwardPaging.attributeTypeMap = [
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
        "type": "Array<ContentFolder>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalContentFolderForwardPaging.js.map