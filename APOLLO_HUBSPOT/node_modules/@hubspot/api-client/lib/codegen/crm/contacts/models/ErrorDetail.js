"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDetail = void 0;
class ErrorDetail {
    static getAttributeTypeMap() {
        return ErrorDetail.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ErrorDetail = ErrorDetail;
ErrorDetail.discriminator = undefined;
ErrorDetail.attributeTypeMap = [
    {
        "name": "message",
        "baseName": "message",
        "type": "string",
        "format": ""
    },
    {
        "name": "_in",
        "baseName": "in",
        "type": "string",
        "format": ""
    },
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "subCategory",
        "baseName": "subCategory",
        "type": "string",
        "format": ""
    },
    {
        "name": "context",
        "baseName": "context",
        "type": "{ [key: string]: Array<string>; }",
        "format": ""
    }
];
//# sourceMappingURL=ErrorDetail.js.map