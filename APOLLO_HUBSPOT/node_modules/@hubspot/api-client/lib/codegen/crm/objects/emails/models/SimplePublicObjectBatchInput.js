"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePublicObjectBatchInput = void 0;
class SimplePublicObjectBatchInput {
    static getAttributeTypeMap() {
        return SimplePublicObjectBatchInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SimplePublicObjectBatchInput = SimplePublicObjectBatchInput;
SimplePublicObjectBatchInput.discriminator = undefined;
SimplePublicObjectBatchInput.attributeTypeMap = [
    {
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=SimplePublicObjectBatchInput.js.map