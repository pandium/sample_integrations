"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardCreateRequest = void 0;
class CardCreateRequest {
    static getAttributeTypeMap() {
        return CardCreateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardCreateRequest = CardCreateRequest;
CardCreateRequest.discriminator = undefined;
CardCreateRequest.attributeTypeMap = [
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
//# sourceMappingURL=CardCreateRequest.js.map