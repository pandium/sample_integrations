"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingExtensionCustomer = void 0;
class AccountingExtensionCustomer {
    static getAttributeTypeMap() {
        return AccountingExtensionCustomer.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AccountingExtensionCustomer = AccountingExtensionCustomer;
AccountingExtensionCustomer.discriminator = undefined;
AccountingExtensionCustomer.attributeTypeMap = [
    {
        "name": "emailAddress",
        "baseName": "emailAddress",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "billingAddress",
        "baseName": "billingAddress",
        "type": "Address",
        "format": ""
    },
    {
        "name": "currencyCode",
        "baseName": "currencyCode",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=AccountingExtensionCustomer.js.map