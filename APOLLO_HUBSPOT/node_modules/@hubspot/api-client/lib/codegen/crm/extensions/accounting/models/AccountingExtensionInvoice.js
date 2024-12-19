"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingExtensionInvoice = void 0;
class AccountingExtensionInvoice {
    static getAttributeTypeMap() {
        return AccountingExtensionInvoice.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AccountingExtensionInvoice = AccountingExtensionInvoice;
AccountingExtensionInvoice.discriminator = undefined;
AccountingExtensionInvoice.attributeTypeMap = [
    {
        "name": "amountDue",
        "baseName": "amountDue",
        "type": "number",
        "format": ""
    },
    {
        "name": "balance",
        "baseName": "balance",
        "type": "number",
        "format": ""
    },
    {
        "name": "dueDate",
        "baseName": "dueDate",
        "type": "string",
        "format": "date"
    },
    {
        "name": "invoiceNumber",
        "baseName": "invoiceNumber",
        "type": "string",
        "format": ""
    },
    {
        "name": "customerId",
        "baseName": "customerId",
        "type": "string",
        "format": ""
    },
    {
        "name": "currency",
        "baseName": "currency",
        "type": "string",
        "format": ""
    },
    {
        "name": "invoiceLink",
        "baseName": "invoiceLink",
        "type": "string",
        "format": ""
    },
    {
        "name": "customerName",
        "baseName": "customerName",
        "type": "string",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "AccountingExtensionInvoiceStatusEnum",
        "format": ""
    }
];
//# sourceMappingURL=AccountingExtensionInvoice.js.map