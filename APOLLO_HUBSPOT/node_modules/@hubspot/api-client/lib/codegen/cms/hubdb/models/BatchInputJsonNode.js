"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputJsonNode = void 0;
class BatchInputJsonNode {
    static getAttributeTypeMap() {
        return BatchInputJsonNode.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputJsonNode = BatchInputJsonNode;
BatchInputJsonNode.discriminator = undefined;
BatchInputJsonNode.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<any>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputJsonNode.js.map