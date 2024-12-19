"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlMapping = void 0;
class UrlMapping {
    static getAttributeTypeMap() {
        return UrlMapping.attributeTypeMap;
    }
    constructor() {
    }
}
exports.UrlMapping = UrlMapping;
UrlMapping.discriminator = undefined;
UrlMapping.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
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
        "name": "precedence",
        "baseName": "precedence",
        "type": "number",
        "format": "int32"
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
    }
];
//# sourceMappingURL=UrlMapping.js.map