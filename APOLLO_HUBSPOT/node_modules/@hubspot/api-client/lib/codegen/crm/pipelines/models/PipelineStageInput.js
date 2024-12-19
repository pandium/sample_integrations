"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStageInput = void 0;
class PipelineStageInput {
    static getAttributeTypeMap() {
        return PipelineStageInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PipelineStageInput = PipelineStageInput;
PipelineStageInput.discriminator = undefined;
PipelineStageInput.attributeTypeMap = [
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
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=PipelineStageInput.js.map