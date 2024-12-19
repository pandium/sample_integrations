"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputSimplePublicObjectBatchInput = void 0;
class BatchInputSimplePublicObjectBatchInput {
    static getAttributeTypeMap() {
        return BatchInputSimplePublicObjectBatchInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputSimplePublicObjectBatchInput = BatchInputSimplePublicObjectBatchInput;
BatchInputSimplePublicObjectBatchInput.discriminator = undefined;
BatchInputSimplePublicObjectBatchInput.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<SimplePublicObjectBatchInput>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputSimplePublicObjectBatchInput.js.map