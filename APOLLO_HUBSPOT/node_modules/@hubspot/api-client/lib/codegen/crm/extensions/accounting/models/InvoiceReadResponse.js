"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceReadResponse = void 0;
class InvoiceReadResponse {
    static getAttributeTypeMap() {
        return InvoiceReadResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InvoiceReadResponse = InvoiceReadResponse;
InvoiceReadResponse.discriminator = undefined;
InvoiceReadResponse.attributeTypeMap = [
    {
        "name": "externalInvoiceNumber",
        "baseName": "externalInvoiceNumber",
        "type": "string",
        "format": ""
    },
    {
        "name": "totalAmountBilled",
        "baseName": "totalAmountBilled",
        "type": "number",
        "format": ""
    },
    {
        "name": "balanceDue",
        "baseName": "balanceDue",
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
        "name": "externalCreateDateTime",
        "baseName": "externalCreateDateTime",
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
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "archivedAt",
        "baseName": "archivedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "externalAccountId",
        "baseName": "externalAccountId",
        "type": "string",
        "format": ""
    },
    {
        "name": "invoiceStatus",
        "baseName": "invoiceStatus",
        "type": "InvoiceReadResponseInvoiceStatusEnum",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=InvoiceReadResponse.js.map