"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicObjectSearchRequest = void 0;
class PublicObjectSearchRequest {
    static getAttributeTypeMap() {
        return PublicObjectSearchRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicObjectSearchRequest = PublicObjectSearchRequest;
PublicObjectSearchRequest.discriminator = undefined;
PublicObjectSearchRequest.attributeTypeMap = [
    {
        "name": "filterGroups",
        "baseName": "filterGroups",
        "type": "Array<FilterGroup>",
        "format": ""
    },
    {
        "name": "sorts",
        "baseName": "sorts",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "query",
        "baseName": "query",
        "type": "string",
        "format": ""
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "limit",
        "baseName": "limit",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "after",
        "baseName": "after",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=PublicObjectSearchRequest.js.map