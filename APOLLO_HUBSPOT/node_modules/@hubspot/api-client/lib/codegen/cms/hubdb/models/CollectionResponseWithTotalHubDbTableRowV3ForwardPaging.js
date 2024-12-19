"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalHubDbTableRowV3ForwardPaging = void 0;
class CollectionResponseWithTotalHubDbTableRowV3ForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalHubDbTableRowV3ForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalHubDbTableRowV3ForwardPaging = CollectionResponseWithTotalHubDbTableRowV3ForwardPaging;
CollectionResponseWithTotalHubDbTableRowV3ForwardPaging.discriminator = undefined;
CollectionResponseWithTotalHubDbTableRowV3ForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<HubDbTableRowV3>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalHubDbTableRowV3ForwardPaging.js.map