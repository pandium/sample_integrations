"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAuditInfo = void 0;
class PublicAuditInfo {
    static getAttributeTypeMap() {
        return PublicAuditInfo.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAuditInfo = PublicAuditInfo;
PublicAuditInfo.discriminator = undefined;
PublicAuditInfo.attributeTypeMap = [
    {
        "name": "portalId",
        "baseName": "portalId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "identifier",
        "baseName": "identifier",
        "type": "string",
        "format": ""
    },
    {
        "name": "action",
        "baseName": "action",
        "type": "string",
        "format": ""
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "message",
        "baseName": "message",
        "type": "string",
        "format": ""
    },
    {
        "name": "rawObject",
        "baseName": "rawObject",
        "type": "any",
        "format": ""
    },
    {
        "name": "fromUserId",
        "baseName": "fromUserId",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=PublicAuditInfo.js.map