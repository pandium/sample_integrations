"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSearchResponse = void 0;
class ListSearchResponse {
    static getAttributeTypeMap() {
        return ListSearchResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ListSearchResponse = ListSearchResponse;
ListSearchResponse.discriminator = undefined;
ListSearchResponse.attributeTypeMap = [
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
        "name": "lists",
        "baseName": "lists",
        "type": "Array<PublicObjectListSearchResult>",
        "format": ""
    },
    {
        "name": "hasMore",
        "baseName": "hasMore",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=ListSearchResponse.js.map