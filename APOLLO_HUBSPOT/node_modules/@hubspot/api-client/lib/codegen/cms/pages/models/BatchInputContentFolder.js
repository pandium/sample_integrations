"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputContentFolder = void 0;
class BatchInputContentFolder {
    static getAttributeTypeMap() {
        return BatchInputContentFolder.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputContentFolder = BatchInputContentFolder;
BatchInputContentFolder.discriminator = undefined;
BatchInputContentFolder.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<ContentFolder>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputContentFolder.js.map