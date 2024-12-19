"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRateResponse = void 0;
class ExchangeRateResponse {
    static getAttributeTypeMap() {
        return ExchangeRateResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ExchangeRateResponse = ExchangeRateResponse;
ExchangeRateResponse.discriminator = undefined;
ExchangeRateResponse.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "ExchangeRateResponseResultEnum",
        "format": ""
    },
    {
        "name": "exchangeRate",
        "baseName": "exchangeRate",
        "type": "number",
        "format": ""
    },
    {
        "name": "sourceCurrencyCode",
        "baseName": "sourceCurrencyCode",
        "type": "string",
        "format": ""
    },
    {
        "name": "targetCurrencyCode",
        "baseName": "targetCurrencyCode",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ExchangeRateResponse.js.map