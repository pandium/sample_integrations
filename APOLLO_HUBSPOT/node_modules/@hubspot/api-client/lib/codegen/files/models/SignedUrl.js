"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedUrl = void 0;
class SignedUrl {
    static getAttributeTypeMap() {
        return SignedUrl.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SignedUrl = SignedUrl;
SignedUrl.discriminator = undefined;
SignedUrl.attributeTypeMap = [
    {
        "name": "expiresAt",
        "baseName": "expiresAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "extension",
        "baseName": "extension",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "string",
        "format": ""
    },
    {
        "name": "size",
        "baseName": "size",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "height",
        "baseName": "height",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "width",
        "baseName": "width",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=SignedUrl.js.map