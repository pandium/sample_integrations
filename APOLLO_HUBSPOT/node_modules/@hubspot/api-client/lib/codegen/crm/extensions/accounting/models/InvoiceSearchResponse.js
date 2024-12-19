"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSearchResponse = void 0;
class InvoiceSearchResponse {
    static getAttributeTypeMap() {
        return InvoiceSearchResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InvoiceSearchResponse = InvoiceSearchResponse;
InvoiceSearchResponse.discriminator = undefined;
InvoiceSearchResponse.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "InvoiceSearchResponseResultEnum",
        "format": ""
    },
    {
        "name": "invoices",
        "baseName": "invoices",
        "type": "Array<AccountingExtensionInvoice>",
        "format": ""
    }
];
//# sourceMappingURL=InvoiceSearchResponse.js.map