"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentSearchResult = void 0;
class ContentSearchResult {
    static getAttributeTypeMap() {
        return ContentSearchResult.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ContentSearchResult = ContentSearchResult;
ContentSearchResult.discriminator = undefined;
ContentSearchResult.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "score",
        "baseName": "score",
        "type": "number",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "ContentSearchResultTypeEnum",
        "format": ""
    },
    {
        "name": "domain",
        "baseName": "domain",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "string",
        "format": ""
    },
    {
        "name": "featuredImageUrl",
        "baseName": "featuredImageUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "language",
        "baseName": "language",
        "type": "ContentSearchResultLanguageEnum",
        "format": ""
    },
    {
        "name": "title",
        "baseName": "title",
        "type": "string",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "category",
        "baseName": "category",
        "type": "string",
        "format": ""
    },
    {
        "name": "subcategory",
        "baseName": "subcategory",
        "type": "string",
        "format": ""
    },
    {
        "name": "authorFullName",
        "baseName": "authorFullName",
        "type": "string",
        "format": ""
    },
    {
        "name": "tags",
        "baseName": "tags",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "tableId",
        "baseName": "tableId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "rowId",
        "baseName": "rowId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "publishedDate",
        "baseName": "publishedDate",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "combinedId",
        "baseName": "combinedId",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ContentSearchResult.js.map