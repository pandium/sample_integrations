"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStagePatchInput = void 0;
class PipelineStagePatchInput {
    static getAttributeTypeMap() {
        return PipelineStagePatchInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PipelineStagePatchInput = PipelineStagePatchInput;
PipelineStagePatchInput.discriminator = undefined;
PipelineStagePatchInput.attributeTypeMap = [
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
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
//# sourceMappingURL=PipelineStagePatchInput.js.map