"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardFetchBodyPatch = void 0;
class CardFetchBodyPatch {
    static getAttributeTypeMap() {
        return CardFetchBodyPatch.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardFetchBodyPatch = CardFetchBodyPatch;
CardFetchBodyPatch.discriminator = undefined;
CardFetchBodyPatch.attributeTypeMap = [
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
//# sourceMappingURL=CardFetchBodyPatch.js.map