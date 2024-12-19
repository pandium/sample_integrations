"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxSearchResponse = void 0;
class TaxSearchResponse {
    static getAttributeTypeMap() {
        return TaxSearchResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TaxSearchResponse = TaxSearchResponse;
TaxSearchResponse.discriminator = undefined;
TaxSearchResponse.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "TaxSearchResponseResultEnum",
        "format": ""
    },
    {
        "name": "taxes",
        "baseName": "taxes",
        "type": "Array<Tax>",
        "format": ""
    }
];
//# sourceMappingURL=TaxSearchResponse.js.map