"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputBlogAuthor = void 0;
class BatchInputBlogAuthor {
    static getAttributeTypeMap() {
        return BatchInputBlogAuthor.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputBlogAuthor = BatchInputBlogAuthor;
BatchInputBlogAuthor.discriminator = undefined;
BatchInputBlogAuthor.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<BlogAuthor>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputBlogAuthor.js.map