"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalHubDbTableV3ForwardPaging = void 0;
class CollectionResponseWithTotalHubDbTableV3ForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalHubDbTableV3ForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalHubDbTableV3ForwardPaging = CollectionResponseWithTotalHubDbTableV3ForwardPaging;
CollectionResponseWithTotalHubDbTableV3ForwardPaging.discriminator = undefined;
CollectionResponseWithTotalHubDbTableV3ForwardPaging.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<HubDbTableV3>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalHubDbTableV3ForwardPaging.js.map