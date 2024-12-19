"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCardResponse = void 0;
class PublicCardResponse {
    static getAttributeTypeMap() {
        return PublicCardResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicCardResponse = PublicCardResponse;
PublicCardResponse.discriminator = undefined;
PublicCardResponse.attributeTypeMap = [
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "fetch",
        "baseName": "fetch",
        "type": "PublicCardFetchBody",
        "format": ""
    },
    {
        "name": "display",
        "baseName": "display",
        "type": "CardDisplayBody",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "title",
        "baseName": "title",
        "type": "string",
        "format": ""
    },
    {
        "name": "actions",
        "baseName": "actions",
        "type": "CardActions",
        "format": ""
    },
    {
        "name": "auditHistory",
        "baseName": "auditHistory",
        "type": "Array<CardAuditResponse>",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=PublicCardResponse.js.map