"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogAuthor = void 0;
class BlogAuthor {
    static getAttributeTypeMap() {
        return BlogAuthor.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BlogAuthor = BlogAuthor;
BlogAuthor.discriminator = undefined;
BlogAuthor.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "fullName",
        "baseName": "fullName",
        "type": "string",
        "format": ""
    },
    {
        "name": "email",
        "baseName": "email",
        "type": "string",
        "format": ""
    },
    {
        "name": "slug",
        "baseName": "slug",
        "type": "string",
        "format": ""
    },
    {
        "name": "language",
        "baseName": "language",
        "type": "BlogAuthorLanguageEnum",
        "format": ""
    },
    {
        "name": "translatedFromId",
        "baseName": "translatedFromId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "displayName",
        "baseName": "displayName",
        "type": "string",
        "format": ""
    },
    {
        "name": "bio",
        "baseName": "bio",
        "type": "string",
        "format": ""
    },
    {
        "name": "website",
        "baseName": "website",
        "type": "string",
        "format": ""
    },
    {
        "name": "twitter",
        "baseName": "twitter",
        "type": "string",
        "format": ""
    },
    {
        "name": "facebook",
        "baseName": "facebook",
        "type": "string",
        "format": ""
    },
    {
        "name": "linkedin",
        "baseName": "linkedin",
        "type": "string",
        "format": ""
    },
    {
        "name": "avatar",
        "baseName": "avatar",
        "type": "string",
        "format": ""
    },
    {
        "name": "created",
        "baseName": "created",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updated",
        "baseName": "updated",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "deletedAt",
        "baseName": "deletedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=BlogAuthor.js.map