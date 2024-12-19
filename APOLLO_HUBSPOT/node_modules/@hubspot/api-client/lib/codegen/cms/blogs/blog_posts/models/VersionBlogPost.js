"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionBlogPost = void 0;
class VersionBlogPost {
    static getAttributeTypeMap() {
        return VersionBlogPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.VersionBlogPost = VersionBlogPost;
VersionBlogPost.discriminator = undefined;
VersionBlogPost.attributeTypeMap = [
    {
        "name": "object",
        "baseName": "object",
        "type": "BlogPost",
        "format": ""
    },
    {
        "name": "user",
        "baseName": "user",
        "type": "VersionUser",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=VersionBlogPost.js.map