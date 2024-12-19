"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingExtensionTerm = void 0;
class AccountingExtensionTerm {
    static getAttributeTypeMap() {
        return AccountingExtensionTerm.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AccountingExtensionTerm = AccountingExtensionTerm;
AccountingExtensionTerm.discriminator = undefined;
AccountingExtensionTerm.attributeTypeMap = [
    {
        "name": "dueDate",
        "baseName": "dueDate",
        "type": "string",
        "format": "date"
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
        "name": "dueDays",
        "baseName": "dueDays",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=AccountingExtensionTerm.js.map