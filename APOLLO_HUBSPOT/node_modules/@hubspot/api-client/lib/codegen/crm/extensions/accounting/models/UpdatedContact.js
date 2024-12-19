"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedContact = void 0;
class UpdatedContact {
    static getAttributeTypeMap() {
        return UpdatedContact.attributeTypeMap;
    }
    constructor() {
    }
}
exports.UpdatedContact = UpdatedContact;
UpdatedContact.discriminator = undefined;
UpdatedContact.attributeTypeMap = [
    {
        "name": "syncAction",
        "baseName": "syncAction",
        "type": "UpdatedContactSyncActionEnum",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "emailAddress",
        "baseName": "emailAddress",
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
        "name": "customerType",
        "baseName": "customerType",
        "type": "UpdatedContactCustomerTypeEnum",
        "format": ""
    }
];
//# sourceMappingURL=UpdatedContact.js.map