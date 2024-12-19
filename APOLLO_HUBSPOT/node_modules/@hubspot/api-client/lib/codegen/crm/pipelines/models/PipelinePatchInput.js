"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelinePatchInput = void 0;
class PipelinePatchInput {
    static getAttributeTypeMap() {
        return PipelinePatchInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PipelinePatchInput = PipelinePatchInput;
PipelinePatchInput.discriminator = undefined;
PipelinePatchInput.attributeTypeMap = [
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "displayOrder",
        "baseName": "displayOrder",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=PipelinePatchInput.js.map