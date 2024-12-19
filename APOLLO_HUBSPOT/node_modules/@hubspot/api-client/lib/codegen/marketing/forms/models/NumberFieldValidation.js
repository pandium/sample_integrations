"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFieldValidation = void 0;
class NumberFieldValidation {
    static getAttributeTypeMap() {
        return NumberFieldValidation.attributeTypeMap;
    }
    constructor() {
    }
}
exports.NumberFieldValidation = NumberFieldValidation;
NumberFieldValidation.discriminator = undefined;
NumberFieldValidation.attributeTypeMap = [
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
//# sourceMappingURL=NumberFieldValidation.js.map