"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    static getAttributeTypeMap() {
        return Product.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Product = Product;
Product.discriminator = undefined;
Product.attributeTypeMap = [
    {
        "name": "unitPrice",
        "baseName": "unitPrice",
        "type": "UnitPrice",
        "format": ""
    },
    {
        "name": "taxExempt",
        "baseName": "taxExempt",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "salesTaxType",
        "baseName": "salesTaxType",
        "type": "TaxType",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=Product.js.map