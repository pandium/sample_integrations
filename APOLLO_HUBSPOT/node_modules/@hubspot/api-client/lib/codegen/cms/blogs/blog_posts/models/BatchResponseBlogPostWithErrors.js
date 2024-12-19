"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseBlogPostWithErrors = void 0;
class BatchResponseBlogPostWithErrors {
    static getAttributeTypeMap() {
        return BatchResponseBlogPostWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseBlogPostWithErrors = BatchResponseBlogPostWithErrors;
BatchResponseBlogPostWithErrors.discriminator = undefined;
BatchResponseBlogPostWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseBlogPostWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<BlogPost>",
        "format": ""
    },
    {
        "name": "numErrors",
        "baseName": "numErrors",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "errors",
        "baseName": "errors",
        "type": "Array<StandardError>",
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
//# sourceMappingURL=BatchResponseBlogPostWithErrors.js.map