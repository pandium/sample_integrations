"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardObjectTypeBody = void 0;
class CardObjectTypeBody {
    static getAttributeTypeMap() {
        return CardObjectTypeBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardObjectTypeBody = CardObjectTypeBody;
CardObjectTypeBody.discriminator = undefined;
CardObjectTypeBody.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "CardObjectTypeBodyNameEnum",
        "format": ""
    },
    {
        "name": "propertiesToSend",
        "baseName": "propertiesToSend",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=CardObjectTypeBody.js.map