"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSearchResults = void 0;
class PublicSearchResults {
    static getAttributeTypeMap() {
        return PublicSearchResults.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicSearchResults = PublicSearchResults;
PublicSearchResults.discriminator = undefined;
PublicSearchResults.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "offset",
        "baseName": "offset",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "limit",
        "baseName": "limit",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<ContentSearchResult>",
        "format": ""
    },
    {
        "name": "searchTerm",
        "baseName": "searchTerm",
        "type": "string",
        "format": ""
    },
    {
        "name": "page",
        "baseName": "page",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=PublicSearchResults.js.map