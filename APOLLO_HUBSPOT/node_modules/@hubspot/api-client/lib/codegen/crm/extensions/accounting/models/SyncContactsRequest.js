"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncContactsRequest = void 0;
class SyncContactsRequest {
    static getAttributeTypeMap() {
        return SyncContactsRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SyncContactsRequest = SyncContactsRequest;
SyncContactsRequest.discriminator = undefined;
SyncContactsRequest.attributeTypeMap = [
    {
        "name": "accountId",
        "baseName": "accountId",
        "type": "string",
        "format": ""
    },
    {
        "name": "contacts",
        "baseName": "contacts",
        "type": "Array<UpdatedContact>",
        "format": ""
    }
];
//# sourceMappingURL=SyncContactsRequest.js.map