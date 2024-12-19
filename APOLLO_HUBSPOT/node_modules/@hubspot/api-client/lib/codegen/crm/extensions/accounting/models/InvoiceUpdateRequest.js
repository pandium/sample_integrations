"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceUpdateRequest = void 0;
class InvoiceUpdateRequest {
    static getAttributeTypeMap() {
        return InvoiceUpdateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InvoiceUpdateRequest = InvoiceUpdateRequest;
InvoiceUpdateRequest.discriminator = undefined;
InvoiceUpdateRequest.attributeTypeMap = [
    {
        "name": "externalInvoiceNumber",
        "baseName": "externalInvoiceNumber",
        "type": "string",
        "format": ""
    },
    {
        "name": "currencyCode",
        "baseName": "currencyCode",
        "type": "string",
        "format": ""
    },
    {
        "name": "dueDate",
        "baseName": "dueDate",
        "type": "string",
        "format": "date"
    },
    {
        "name": "externalRecipientId",
        "baseName": "externalRecipientId",
        "type": "string",
        "format": ""
    },
    {
        "name": "receivedByRecipientDate",
        "baseName": "receivedByRecipientDate",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "isVoided",
        "baseName": "isVoided",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "receivedByCustomerDate",
        "baseName": "receivedByCustomerDate",
        "type": "string",
        "format": ""
    },
    {
        "name": "invoiceNumber",
        "baseName": "invoiceNumber",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=InvoiceUpdateRequest.js.map