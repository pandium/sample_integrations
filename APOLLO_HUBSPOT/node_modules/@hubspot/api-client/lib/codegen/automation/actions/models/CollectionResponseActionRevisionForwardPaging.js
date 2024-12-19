"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseActionRevisionForwardPaging = void 0;
class CollectionResponseActionRevisionForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseActionRevisionForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseActionRevisionForwardPaging = CollectionResponseActionRevisionForwardPaging;
CollectionResponseActionRevisionForwardPaging.discriminator = undefined;
CollectionResponseActionRevisionForwardPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<ActionRevision>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseActionRevisionForwardPaging.js.map