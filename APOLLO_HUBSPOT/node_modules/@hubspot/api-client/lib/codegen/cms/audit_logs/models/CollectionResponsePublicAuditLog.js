"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicAuditLog = void 0;
class CollectionResponsePublicAuditLog {
    static getAttributeTypeMap() {
        return CollectionResponsePublicAuditLog.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicAuditLog = CollectionResponsePublicAuditLog;
CollectionResponsePublicAuditLog.discriminator = undefined;
CollectionResponsePublicAuditLog.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicAuditLog>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicAuditLog.js.map