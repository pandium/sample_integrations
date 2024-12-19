"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardFetchBody = void 0;
class CardFetchBody {
    static getAttributeTypeMap() {
        return CardFetchBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardFetchBody = CardFetchBody;
CardFetchBody.discriminator = undefined;
CardFetchBody.attributeTypeMap = [
    {
        "name": "targetUrl",
        "baseName": "targetUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "objectTypes",
        "baseName": "objectTypes",
        "type": "Array<CardObjectTypeBody>",
        "format": ""
    }
];
//# sourceMappingURL=CardFetchBody.js.map