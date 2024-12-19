"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputTag = void 0;
class BatchInputTag {
    static getAttributeTypeMap() {
        return BatchInputTag.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputTag = BatchInputTag;
BatchInputTag.discriminator = undefined;
BatchInputTag.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<Tag>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputTag.js.map