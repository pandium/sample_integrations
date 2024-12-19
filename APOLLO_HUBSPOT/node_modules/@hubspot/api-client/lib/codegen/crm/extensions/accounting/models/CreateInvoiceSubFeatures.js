"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvoiceSubFeatures = void 0;
class CreateInvoiceSubFeatures {
    static getAttributeTypeMap() {
        return CreateInvoiceSubFeatures.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CreateInvoiceSubFeatures = CreateInvoiceSubFeatures;
CreateInvoiceSubFeatures.discriminator = undefined;
CreateInvoiceSubFeatures.attributeTypeMap = [
    {
        "name": "createCustomer",
        "baseName": "createCustomer",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "taxes",
        "baseName": "taxes",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "exchangeRates",
        "baseName": "exchangeRates",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "terms",
        "baseName": "terms",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "invoiceComments",
        "baseName": "invoiceComments",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "invoiceDiscounts",
        "baseName": "invoiceDiscounts",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=CreateInvoiceSubFeatures.js.map