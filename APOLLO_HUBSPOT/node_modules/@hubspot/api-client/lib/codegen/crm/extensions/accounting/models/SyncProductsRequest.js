"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncProductsRequest = void 0;
class SyncProductsRequest {
    static getAttributeTypeMap() {
        return SyncProductsRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SyncProductsRequest = SyncProductsRequest;
SyncProductsRequest.discriminator = undefined;
SyncProductsRequest.attributeTypeMap = [
    {
        "name": "accountId",
        "baseName": "accountId",
        "type": "string",
        "format": ""
    },
    {
        "name": "products",
        "baseName": "products",
        "type": "Array<UpdatedProduct>",
        "format": ""
    }
];
//# sourceMappingURL=SyncProductsRequest.js.map