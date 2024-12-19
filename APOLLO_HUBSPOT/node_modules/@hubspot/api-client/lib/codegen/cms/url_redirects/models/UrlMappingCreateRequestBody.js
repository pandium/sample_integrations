"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlMappingCreateRequestBody = void 0;
class UrlMappingCreateRequestBody {
    static getAttributeTypeMap() {
        return UrlMappingCreateRequestBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.UrlMappingCreateRequestBody = UrlMappingCreateRequestBody;
UrlMappingCreateRequestBody.discriminator = undefined;
UrlMappingCreateRequestBody.attributeTypeMap = [
    {
        "name": "precedence",
        "baseName": "precedence",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "isOnlyAfterNotFound",
        "baseName": "isOnlyAfterNotFound",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isMatchFullUrl",
        "baseName": "isMatchFullUrl",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isMatchQueryString",
        "baseName": "isMatchQueryString",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isPattern",
        "baseName": "isPattern",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isTrailingSlashOptional",
        "baseName": "isTrailingSlashOptional",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isProtocolAgnostic",
        "baseName": "isProtocolAgnostic",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "routePrefix",
        "baseName": "routePrefix",
        "type": "string",
        "format": ""
    },
    {
        "name": "destination",
        "baseName": "destination",
        "type": "string",
        "format": ""
    },
    {
        "name": "redirectStyle",
        "baseName": "redirectStyle",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=UrlMappingCreateRequestBody.js.map