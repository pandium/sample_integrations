"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseBlogPost = void 0;
class BatchResponseBlogPost {
    static getAttributeTypeMap() {
        return BatchResponseBlogPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseBlogPost = BatchResponseBlogPost;
BatchResponseBlogPost.discriminator = undefined;
BatchResponseBlogPost.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseBlogPostStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<BlogPost>",
        "format": ""
    },
    {
        "name": "requestedAt",
        "baseName": "requestedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "startedAt",
        "baseName": "startedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "completedAt",
        "baseName": "completedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "links",
        "baseName": "links",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=BatchResponseBlogPost.js.map