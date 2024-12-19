"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchReadInputPropertyName = void 0;
class BatchReadInputPropertyName {
    static getAttributeTypeMap() {
        return BatchReadInputPropertyName.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchReadInputPropertyName = BatchReadInputPropertyName;
BatchReadInputPropertyName.discriminator = undefined;
BatchReadInputPropertyName.attributeTypeMap = [
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PropertyName>",
        "format": ""
    }
];
//# sourceMappingURL=BatchReadInputPropertyName.js.map