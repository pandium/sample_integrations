"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneFieldValidation = void 0;
class PhoneFieldValidation {
    static getAttributeTypeMap() {
        return PhoneFieldValidation.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PhoneFieldValidation = PhoneFieldValidation;
PhoneFieldValidation.discriminator = undefined;
PhoneFieldValidation.attributeTypeMap = [
    {
        "name": "minAllowedDigits",
        "baseName": "minAllowedDigits",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "maxAllowedDigits",
        "baseName": "maxAllowedDigits",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=PhoneFieldValidation.js.map