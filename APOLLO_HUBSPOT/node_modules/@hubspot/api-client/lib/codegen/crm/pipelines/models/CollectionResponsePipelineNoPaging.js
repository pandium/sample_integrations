"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePipelineNoPaging = void 0;
class CollectionResponsePipelineNoPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePipelineNoPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePipelineNoPaging = CollectionResponsePipelineNoPaging;
CollectionResponsePipelineNoPaging.discriminator = undefined;
CollectionResponsePipelineNoPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Pipeline>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePipelineNoPaging.js.map