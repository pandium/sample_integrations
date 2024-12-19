"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesResponseExternal = void 0;
class InvoicesResponseExternal {
    static getAttributeTypeMap() {
        return InvoicesResponseExternal.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InvoicesResponseExternal = InvoicesResponseExternal;
InvoicesResponseExternal.discriminator = undefined;
InvoicesResponseExternal.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "InvoicesResponseExternalResultEnum",
        "format": ""
    },
    {
        "name": "invoices",
        "baseName": "invoices",
        "type": "Array<AccountingExtensionInvoice>",
        "format": ""
    }
];
//# sourceMappingURL=InvoicesResponseExternal.js.map