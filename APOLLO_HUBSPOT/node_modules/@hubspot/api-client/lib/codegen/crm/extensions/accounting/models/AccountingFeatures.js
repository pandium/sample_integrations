"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingFeatures = void 0;
class AccountingFeatures {
    static getAttributeTypeMap() {
        return AccountingFeatures.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AccountingFeatures = AccountingFeatures;
AccountingFeatures.discriminator = undefined;
AccountingFeatures.attributeTypeMap = [
    {
        "name": "createInvoice",
        "baseName": "createInvoice",
        "type": "CreateInvoiceFeature",
        "format": ""
    },
    {
        "name": "importInvoice",
        "baseName": "importInvoice",
        "type": "ImportInvoiceFeature",
        "format": ""
    },
    {
        "name": "sync",
        "baseName": "sync",
        "type": "{ [key: string]: ObjectSyncFeature; }",
        "format": ""
    }
];
//# sourceMappingURL=AccountingFeatures.js.map