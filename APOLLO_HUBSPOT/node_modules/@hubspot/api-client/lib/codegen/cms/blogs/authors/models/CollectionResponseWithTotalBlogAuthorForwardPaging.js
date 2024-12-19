"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalBlogAuthorForwardPaging = void 0;
class CollectionResponseWithTotalBlogAuthorForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalBlogAuthorForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalBlogAuthorForwardPaging = CollectionResponseWithTotalBlogAuthorForwardPaging;
CollectionResponseWithTotalBlogAuthorForwardPaging.discriminator = undefined;
CollectionResponseWithTotalBlogAuthorForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<BlogAuthor>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalBlogAuthorForwardPaging.js.map