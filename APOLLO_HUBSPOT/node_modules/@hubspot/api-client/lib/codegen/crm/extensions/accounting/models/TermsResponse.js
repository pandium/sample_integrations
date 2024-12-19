"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsResponse = void 0;
class TermsResponse {
    static getAttributeTypeMap() {
        return TermsResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TermsResponse = TermsResponse;
TermsResponse.discriminator = undefined;
TermsResponse.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "TermsResponseResultEnum",
        "format": ""
    },
    {
        "name": "terms",
        "baseName": "terms",
        "type": "Array<AccountingExtensionTerm>",
        "format": ""
    }
];
//# sourceMappingURL=TermsResponse.js.map