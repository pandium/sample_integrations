"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicePdfResponse = void 0;
class InvoicePdfResponse {
    static getAttributeTypeMap() {
        return InvoicePdfResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InvoicePdfResponse = InvoicePdfResponse;
InvoicePdfResponse.discriminator = undefined;
InvoicePdfResponse.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "InvoicePdfResponseResultEnum",
        "format": ""
    },
    {
        "name": "invoice",
        "baseName": "invoice",
        "type": "string",
        "format": "byte"
    }
];
//# sourceMappingURL=InvoicePdfResponse.js.map