"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicAuditInfoNoPaging = void 0;
class CollectionResponsePublicAuditInfoNoPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicAuditInfoNoPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicAuditInfoNoPaging = CollectionResponsePublicAuditInfoNoPaging;
CollectionResponsePublicAuditInfoNoPaging.discriminator = undefined;
CollectionResponsePublicAuditInfoNoPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicAuditInfo>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicAuditInfoNoPaging.js.map