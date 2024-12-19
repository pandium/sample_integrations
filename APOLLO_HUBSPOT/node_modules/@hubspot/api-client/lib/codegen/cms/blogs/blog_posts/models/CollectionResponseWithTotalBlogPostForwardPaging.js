"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalBlogPostForwardPaging = void 0;
class CollectionResponseWithTotalBlogPostForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalBlogPostForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalBlogPostForwardPaging = CollectionResponseWithTotalBlogPostForwardPaging;
CollectionResponseWithTotalBlogPostForwardPaging.discriminator = undefined;
CollectionResponseWithTotalBlogPostForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<BlogPost>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalBlogPostForwardPaging.js.map