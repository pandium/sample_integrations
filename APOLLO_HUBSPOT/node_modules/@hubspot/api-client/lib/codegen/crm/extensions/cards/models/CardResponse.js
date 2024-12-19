"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardResponse = void 0;
class CardResponse {
    static getAttributeTypeMap() {
        return CardResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardResponse = CardResponse;
CardResponse.discriminator = undefined;
CardResponse.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "title",
        "baseName": "title",
        "type": "string",
        "format": ""
    },
    {
        "name": "fetch",
        "baseName": "fetch",
        "type": "CardFetchBody",
        "format": ""
    },
    {
        "name": "display",
        "baseName": "display",
        "type": "CardDisplayBody",
        "format": ""
    },
    {
        "name": "actions",
        "baseName": "actions",
        "type": "CardActions",
        "format": ""
    }
];
//# sourceMappingURL=CardResponse.js.map