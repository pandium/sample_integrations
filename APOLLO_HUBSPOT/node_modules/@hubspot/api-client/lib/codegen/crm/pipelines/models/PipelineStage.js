"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStage = void 0;
class PipelineStage {
    static getAttributeTypeMap() {
        return PipelineStage.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PipelineStage = PipelineStage;
PipelineStage.discriminator = undefined;
PipelineStage.attributeTypeMap = [
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
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "archivedAt",
        "baseName": "archivedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=PipelineStage.js.map