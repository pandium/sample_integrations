"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputFieldDefinition = void 0;
class OutputFieldDefinition {
    static getAttributeTypeMap() {
        return OutputFieldDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.OutputFieldDefinition = OutputFieldDefinition;
OutputFieldDefinition.discriminator = undefined;
OutputFieldDefinition.attributeTypeMap = [
    {
        "name": "typeDefinition",
        "baseName": "typeDefinition",
        "type": "FieldTypeDefinition",
        "format": ""
    }
];
//# sourceMappingURL=OutputFieldDefinition.js.map