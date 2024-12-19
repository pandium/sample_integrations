"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceUpdateResponse = void 0;
class InvoiceUpdateResponse {
    static getAttributeTypeMap() {
        return InvoiceUpdateResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InvoiceUpdateResponse = InvoiceUpdateResponse;
InvoiceUpdateResponse.discriminator = undefined;
InvoiceUpdateResponse.attributeTypeMap = [
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
        "type": "InvoiceUpdateResponseInvoiceStatusEnum",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=InvoiceUpdateResponse.js.map