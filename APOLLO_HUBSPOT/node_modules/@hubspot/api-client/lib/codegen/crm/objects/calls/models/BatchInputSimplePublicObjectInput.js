"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputSimplePublicObjectInput = void 0;
class BatchInputSimplePublicObjectInput {
    static getAttributeTypeMap() {
        return BatchInputSimplePublicObjectInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputSimplePublicObjectInput = BatchInputSimplePublicObjectInput;
BatchInputSimplePublicObjectInput.discriminator = undefined;
BatchInputSimplePublicObjectInput.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<SimplePublicObjectInput>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputSimplePublicObjectInput.js.map