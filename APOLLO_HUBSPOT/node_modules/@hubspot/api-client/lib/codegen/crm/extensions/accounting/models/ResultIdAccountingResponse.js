"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultIdAccountingResponse = void 0;
class ResultIdAccountingResponse {
    static getAttributeTypeMap() {
        return ResultIdAccountingResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ResultIdAccountingResponse = ResultIdAccountingResponse;
ResultIdAccountingResponse.discriminator = undefined;
ResultIdAccountingResponse.attributeTypeMap = [
    {
        "name": "result",
        "baseName": "@result",
        "type": "ResultIdAccountingResponseResultEnum",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ResultIdAccountingResponse.js.map