"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalTagForwardPaging = void 0;
class CollectionResponseWithTotalTagForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalTagForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalTagForwardPaging = CollectionResponseWithTotalTagForwardPaging;
CollectionResponseWithTotalTagForwardPaging.discriminator = undefined;
CollectionResponseWithTotalTagForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Tag>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalTagForwardPaging.js.map