"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalSimplePublicObjectForwardPaging = void 0;
class CollectionResponseWithTotalSimplePublicObjectForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalSimplePublicObjectForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalSimplePublicObjectForwardPaging = CollectionResponseWithTotalSimplePublicObjectForwardPaging;
CollectionResponseWithTotalSimplePublicObjectForwardPaging.discriminator = undefined;
CollectionResponseWithTotalSimplePublicObjectForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SimplePublicObject>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalSimplePublicObjectForwardPaging.js.map