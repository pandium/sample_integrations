"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardAuditResponseAuthSourceEnum = exports.CardAuditResponseActionTypeEnum = exports.CardAuditResponse = void 0;
class CardAuditResponse {
    static getAttributeTypeMap() {
        return CardAuditResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardAuditResponse = CardAuditResponse;
CardAuditResponse.discriminator = undefined;
CardAuditResponse.attributeTypeMap = [
    {
        "name": "actionType",
        "baseName": "actionType",
        "type": "CardAuditResponseActionTypeEnum",
        "format": ""
    },
    {
        "name": "objectTypeId",
        "baseName": "objectTypeId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "authSource",
        "baseName": "authSource",
        "type": "CardAuditResponseAuthSourceEnum",
        "format": ""
    },
    {
        "name": "changedAt",
        "baseName": "changedAt",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "applicationId",
        "baseName": "applicationId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "initiatingUserId",
        "baseName": "initiatingUserId",
        "type": "number",
        "format": "int32"
    }
];
var CardAuditResponseActionTypeEnum;
(function (CardAuditResponseActionTypeEnum) {
    CardAuditResponseActionTypeEnum["Create"] = "CREATE";
    CardAuditResponseActionTypeEnum["Update"] = "UPDATE";
    CardAuditResponseActionTypeEnum["Delete"] = "DELETE";
})(CardAuditResponseActionTypeEnum = exports.CardAuditResponseActionTypeEnum || (exports.CardAuditResponseActionTypeEnum = {}));
var CardAuditResponseAuthSourceEnum;
(function (CardAuditResponseAuthSourceEnum) {
    CardAuditResponseAuthSourceEnum["Internal"] = "INTERNAL";
    CardAuditResponseAuthSourceEnum["App"] = "APP";
    CardAuditResponseAuthSourceEnum["External"] = "EXTERNAL";
})(CardAuditResponseAuthSourceEnum = exports.CardAuditResponseAuthSourceEnum || (exports.CardAuditResponseAuthSourceEnum = {}));
//# sourceMappingURL=CardAuditResponse.js.map