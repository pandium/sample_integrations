"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentLanguageVariation = void 0;
class ContentLanguageVariation {
    static getAttributeTypeMap() {
        return ContentLanguageVariation.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ContentLanguageVariation = ContentLanguageVariation;
ContentLanguageVariation.discriminator = undefined;
ContentLanguageVariation.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
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
        "name": "slug",
        "baseName": "slug",
        "type": "string",
        "format": ""
    },
    {
        "name": "state",
        "baseName": "state",
        "type": "string",
        "format": ""
    },
    {
        "name": "authorName",
        "baseName": "authorName",
        "type": "string",
        "format": ""
    },
    {
        "name": "password",
        "baseName": "password",
        "type": "string",
        "format": ""
    },
    {
        "name": "publicAccessRulesEnabled",
        "baseName": "publicAccessRulesEnabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "publicAccessRules",
        "baseName": "publicAccessRules",
        "type": "Array<any>",
        "format": ""
    },
    {
        "name": "campaign",
        "baseName": "campaign",
        "type": "string",
        "format": ""
    },
    {
        "name": "tagIds",
        "baseName": "tagIds",
        "type": "Array<number>",
        "format": "int64"
    },
    {
        "name": "archivedInDashboard",
        "baseName": "archivedInDashboard",
        "type": "boolean",
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
        "name": "publishDate",
        "baseName": "publishDate",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=ContentLanguageVariation.js.map