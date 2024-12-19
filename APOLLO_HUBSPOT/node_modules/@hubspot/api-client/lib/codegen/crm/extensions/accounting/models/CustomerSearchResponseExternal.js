"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSearchResponseExternal = void 0;
class CustomerSearchResponseExternal {
    static getAttributeTypeMap() {
        return CustomerSearchResponseExternal.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CustomerSearchResponseExternal = CustomerSearchResponseExternal;
CustomerSearchResponseExternal.discriminator = undefined;
CustomerSearchResponseExternal.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "CustomerSearchResponseExternalResultEnum",
        "format": ""
    },
    {
        "name": "customers",
        "baseName": "customers",
        "type": "Array<AccountingExtensionCustomer>",
        "format": ""
    }
];
//# sourceMappingURL=CustomerSearchResponseExternal.js.map