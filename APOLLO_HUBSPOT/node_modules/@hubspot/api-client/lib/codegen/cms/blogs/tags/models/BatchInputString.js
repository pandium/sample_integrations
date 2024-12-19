"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputString = void 0;
class BatchInputString {
    static getAttributeTypeMap() {
        return BatchInputString.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputString = BatchInputString;
BatchInputString.discriminator = undefined;
BatchInputString.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputString.js.map