"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalVersionBlogPost = void 0;
class CollectionResponseWithTotalVersionBlogPost {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalVersionBlogPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalVersionBlogPost = CollectionResponseWithTotalVersionBlogPost;
CollectionResponseWithTotalVersionBlogPost.discriminator = undefined;
CollectionResponseWithTotalVersionBlogPost.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<VersionBlogPost>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalVersionBlogPost.js.map