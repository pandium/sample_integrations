"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalDomainForwardPaging = void 0;
class CollectionResponseWithTotalDomainForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalDomainForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalDomainForwardPaging = CollectionResponseWithTotalDomainForwardPaging;
CollectionResponseWithTotalDomainForwardPaging.discriminator = undefined;
CollectionResponseWithTotalDomainForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Domain>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalDomainForwardPaging.js.map