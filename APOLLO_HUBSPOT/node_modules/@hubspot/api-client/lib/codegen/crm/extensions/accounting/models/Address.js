"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    static getAttributeTypeMap() {
        return Address.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Address = Address;
Address.discriminator = undefined;
Address.attributeTypeMap = [
    {
        "name": "country",
        "baseName": "country",
        "type": "string",
        "format": ""
    },
    {
        "name": "countrySubDivisionCode",
        "baseName": "countrySubDivisionCode",
        "type": "string",
        "format": ""
    },
    {
        "name": "city",
        "baseName": "city",
        "type": "string",
        "format": ""
    },
    {
        "name": "postalCode",
        "baseName": "postalCode",
        "type": "string",
        "format": ""
    },
    {
        "name": "lineOne",
        "baseName": "lineOne",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=Address.js.map