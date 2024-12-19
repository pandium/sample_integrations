"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxType = void 0;
class TaxType {
    static getAttributeTypeMap() {
        return TaxType.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TaxType = TaxType;
TaxType.discriminator = undefined;
TaxType.attributeTypeMap = [
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=TaxType.js.map