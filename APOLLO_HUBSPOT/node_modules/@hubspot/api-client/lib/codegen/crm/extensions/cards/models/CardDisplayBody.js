"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDisplayBody = void 0;
class CardDisplayBody {
    static getAttributeTypeMap() {
        return CardDisplayBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardDisplayBody = CardDisplayBody;
CardDisplayBody.discriminator = undefined;
CardDisplayBody.attributeTypeMap = [
    {
        "name": "properties",
        "baseName": "properties",
        "type": "Array<CardDisplayProperty>",
        "format": ""
    }
];
//# sourceMappingURL=CardDisplayBody.js.map