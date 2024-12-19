"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelError = void 0;
class ModelError {
    static getAttributeTypeMap() {
        return ModelError.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ModelError = ModelError;
ModelError.discriminator = undefined;
ModelError.attributeTypeMap = [
    {
        "name": "message",
        "baseName": "message",
        "type": "string",
        "format": ""
    },
    {
        "name": "correlationId",
        "baseName": "correlationId",
        "type": "string",
        "format": "uuid"
    },
    {
        "name": "category",
        "baseName": "category",
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
        "name": "errors",
        "baseName": "errors",
        "type": "Array<ErrorDetail>",
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
    }
];
//# sourceMappingURL=ModelError.js.map