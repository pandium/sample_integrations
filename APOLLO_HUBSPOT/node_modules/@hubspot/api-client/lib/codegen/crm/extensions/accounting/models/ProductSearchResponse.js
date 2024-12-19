"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSearchResponse = void 0;
class ProductSearchResponse {
    static getAttributeTypeMap() {
        return ProductSearchResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ProductSearchResponse = ProductSearchResponse;
ProductSearchResponse.discriminator = undefined;
ProductSearchResponse.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "ProductSearchResponseResultEnum",
        "format": ""
    },
    {
        "name": "products",
        "baseName": "products",
        "type": "Array<Product>",
        "format": ""
    }
];
//# sourceMappingURL=ProductSearchResponse.js.map