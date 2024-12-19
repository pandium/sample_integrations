"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseBlogAuthorWithErrors = void 0;
class BatchResponseBlogAuthorWithErrors {
    static getAttributeTypeMap() {
        return BatchResponseBlogAuthorWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseBlogAuthorWithErrors = BatchResponseBlogAuthorWithErrors;
BatchResponseBlogAuthorWithErrors.discriminator = undefined;
BatchResponseBlogAuthorWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseBlogAuthorWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<BlogAuthor>",
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
//# sourceMappingURL=BatchResponseBlogAuthorWithErrors.js.map