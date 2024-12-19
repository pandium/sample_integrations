"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePipelineStageNoPaging = void 0;
class CollectionResponsePipelineStageNoPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePipelineStageNoPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePipelineStageNoPaging = CollectionResponsePipelineStageNoPaging;
CollectionResponsePipelineStageNoPaging.discriminator = undefined;
CollectionResponsePipelineStageNoPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PipelineStage>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePipelineStageNoPaging.js.map