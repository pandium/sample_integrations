"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePublicObjectInput = void 0;
class SimplePublicObjectInput {
    static getAttributeTypeMap() {
        return SimplePublicObjectInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SimplePublicObjectInput = SimplePublicObjectInput;
SimplePublicObjectInput.discriminator = undefined;
SimplePublicObjectInput.attributeTypeMap = [
    {
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=SimplePublicObjectInput.js.map