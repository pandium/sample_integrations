"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputPropertyCreate = void 0;
class BatchInputPropertyCreate {
    static getAttributeTypeMap() {
        return BatchInputPropertyCreate.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputPropertyCreate = BatchInputPropertyCreate;
BatchInputPropertyCreate.discriminator = undefined;
BatchInputPropertyCreate.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PropertyCreate>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputPropertyCreate.js.map