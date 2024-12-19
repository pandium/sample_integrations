"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceCreatePaymentRequest = void 0;
class InvoiceCreatePaymentRequest {
    static getAttributeTypeMap() {
        return InvoiceCreatePaymentRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InvoiceCreatePaymentRequest = InvoiceCreatePaymentRequest;
InvoiceCreatePaymentRequest.discriminator = undefined;
InvoiceCreatePaymentRequest.attributeTypeMap = [
    {
        "name": "amountPaid",
        "baseName": "amountPaid",
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
        "name": "paymentDateTime",
        "baseName": "paymentDateTime",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "externalPaymentId",
        "baseName": "externalPaymentId",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=InvoiceCreatePaymentRequest.js.map