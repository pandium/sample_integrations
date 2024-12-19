"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPatchRequest = void 0;
class CardPatchRequest {
    static getAttributeTypeMap() {
        return CardPatchRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardPatchRequest = CardPatchRequest;
CardPatchRequest.discriminator = undefined;
CardPatchRequest.attributeTypeMap = [
    {
        "name": "title",
        "baseName": "title",
        "type": "string",
        "format": ""
    },
    {
        "name": "fetch",
        "baseName": "fetch",
        "type": "CardFetchBodyPatch",
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
//# sourceMappingURL=CardPatchRequest.js.map