"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputBlogPost = void 0;
class BatchInputBlogPost {
    static getAttributeTypeMap() {
        return BatchInputBlogPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputBlogPost = BatchInputBlogPost;
BatchInputBlogPost.discriminator = undefined;
BatchInputBlogPost.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<BlogPost>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputBlogPost.js.map