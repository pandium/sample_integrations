"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tax = void 0;
class Tax {
    static getAttributeTypeMap() {
        return Tax.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Tax = Tax;
Tax.discriminator = undefined;
Tax.attributeTypeMap = [
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "percentage",
        "baseName": "percentage",
        "type": "number",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=Tax.js.map