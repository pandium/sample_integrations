"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitPrice = void 0;
class UnitPrice {
    static getAttributeTypeMap() {
        return UnitPrice.attributeTypeMap;
    }
    constructor() {
    }
}
exports.UnitPrice = UnitPrice;
UnitPrice.discriminator = undefined;
UnitPrice.attributeTypeMap = [
    {
        "name": "amount",
        "baseName": "amount",
        "type": "number",
        "format": ""
    },
    {
        "name": "taxIncluded",
        "baseName": "taxIncluded",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=UnitPrice.js.map