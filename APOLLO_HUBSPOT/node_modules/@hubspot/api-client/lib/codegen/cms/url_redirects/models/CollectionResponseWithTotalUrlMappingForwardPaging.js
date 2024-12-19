"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalUrlMappingForwardPaging = void 0;
class CollectionResponseWithTotalUrlMappingForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalUrlMappingForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalUrlMappingForwardPaging = CollectionResponseWithTotalUrlMappingForwardPaging;
CollectionResponseWithTotalUrlMappingForwardPaging.discriminator = undefined;
CollectionResponseWithTotalUrlMappingForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<UrlMapping>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalUrlMappingForwardPaging.js.map