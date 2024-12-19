"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardError = void 0;
class StandardError {
    static getAttributeTypeMap() {
        return StandardError.attributeTypeMap;
    }
    constructor() {
    }
}
exports.StandardError = StandardError;
StandardError.discriminator = undefined;
StandardError.attributeTypeMap = [
    {
        "name": "subCategory",
        "baseName": "subCategory",
        "type": "any",
        "format": ""
    },
    {
        "name": "context",
        "baseName": "context",
        "type": "{ [key: string]: Array<string>; }",
        "format": ""
    },
    {
        "name": "links",
        "baseName": "links",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
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
        "name": "message",
        "baseName": "message",
        "type": "string",
        "format": ""
    },
    {
        "name": "errors",
        "baseName": "errors",
        "type": "Array<ErrorDetail>",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=StandardError.js.map