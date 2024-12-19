"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDisplayProperty = void 0;
class CardDisplayProperty {
    static getAttributeTypeMap() {
        return CardDisplayProperty.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CardDisplayProperty = CardDisplayProperty;
CardDisplayProperty.discriminator = undefined;
CardDisplayProperty.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "dataType",
        "baseName": "dataType",
        "type": "CardDisplayPropertyDataTypeEnum",
        "format": ""
    },
    {
        "name": "options",
        "baseName": "options",
        "type": "Array<DisplayOption>",
        "format": ""
    }
];
//# sourceMappingURL=CardDisplayProperty.js.map