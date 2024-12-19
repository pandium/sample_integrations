"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardListResponse = void 0;
class CardListResponse {
    static getAttributeTypeMap() {
        return CardListResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardListResponse = CardListResponse;
CardListResponse.discriminator = undefined;
CardListResponse.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<CardResponse>",
        "format": ""
    }
];
//# sourceMappingURL=CardListResponse.js.map