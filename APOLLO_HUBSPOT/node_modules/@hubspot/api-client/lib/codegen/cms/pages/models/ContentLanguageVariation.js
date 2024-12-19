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
        "name": "tagIds",
        "baseName": "tagIds",
        "type": "Array<number>",
        "format": "int64"
    },
    {
        "name": "publishDate",
        "baseName": "publishDate",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "publicAccessRules",
        "baseName": "publicAccessRules",
        "type": "Array<any>",
        "format": ""
    },
    {
        "name": "password",
        "baseName": "password",
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
        "name": "publicAccessRulesEnabled",
        "baseName": "publicAccessRulesEnabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "campaign",
        "baseName": "campaign",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "state",
        "baseName": "state",
        "type": "string",
        "format": ""
    },
    {
        "name": "updated",
        "baseName": "updated",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "slug",
        "baseName": "slug",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ContentLanguageVariation.js.map