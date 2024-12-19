"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineInput = void 0;
class PipelineInput {
    static getAttributeTypeMap() {
        return PipelineInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PipelineInput = PipelineInput;
PipelineInput.discriminator = undefined;
PipelineInput.attributeTypeMap = [
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
        "name": "stages",
        "baseName": "stages",
        "type": "Array<PipelineStageInput>",
        "format": ""
    }
];
//# sourceMappingURL=PipelineInput.js.map