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
        "name": "query",
        "baseName": "query",
        "type": "string",
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
        "type": "string",
        "format": ""
    },
    {
        "name": "sorts",
        "baseName": "sorts",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "filterGroups",
        "baseName": "filterGroups",
        "type": "Array<FilterGroup>",
        "format": ""
    }
];
//# sourceMappingURL=PublicObjectSearchRequest.js.map