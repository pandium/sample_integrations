"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedProduct = void 0;
class UpdatedProduct {
    static getAttributeTypeMap() {
        return UpdatedProduct.attributeTypeMap;
    }
    constructor() {
    }
}
exports.UpdatedProduct = UpdatedProduct;
UpdatedProduct.discriminator = undefined;
UpdatedProduct.attributeTypeMap = [
    {
        "name": "syncAction",
        "baseName": "syncAction",
        "type": "UpdatedProductSyncActionEnum",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "price",
        "baseName": "price",
        "type": "number",
        "format": ""
    },
    {
        "name": "currencyCode",
        "baseName": "currencyCode",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=UpdatedProduct.js.map