"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseBlogAuthor = void 0;
class BatchResponseBlogAuthor {
    static getAttributeTypeMap() {
        return BatchResponseBlogAuthor.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseBlogAuthor = BatchResponseBlogAuthor;
BatchResponseBlogAuthor.discriminator = undefined;
BatchResponseBlogAuthor.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseBlogAuthorStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<BlogAuthor>",
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
//# sourceMappingURL=BatchResponseBlogAuthor.js.map