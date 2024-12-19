"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvoiceFeature = void 0;
class CreateInvoiceFeature {
    static getAttributeTypeMap() {
        return CreateInvoiceFeature.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CreateInvoiceFeature = CreateInvoiceFeature;
CreateInvoiceFeature.discriminator = undefined;
CreateInvoiceFeature.attributeTypeMap = [
    {
        "name": "enabled",
        "baseName": "enabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "subFeatures",
        "baseName": "subFeatures",
        "type": "CreateInvoiceSubFeatures",
        "format": ""
    }
];
//# sourceMappingURL=CreateInvoiceFeature.js.map