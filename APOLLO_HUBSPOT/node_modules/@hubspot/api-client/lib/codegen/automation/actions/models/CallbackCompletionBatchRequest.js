"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackCompletionBatchRequest = void 0;
class CallbackCompletionBatchRequest {
    static getAttributeTypeMap() {
        return CallbackCompletionBatchRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CallbackCompletionBatchRequest = CallbackCompletionBatchRequest;
CallbackCompletionBatchRequest.discriminator = undefined;
CallbackCompletionBatchRequest.attributeTypeMap = [
    {
        "name": "callbackId",
        "baseName": "callbackId",
        "type": "string",
        "format": ""
    },
    {
        "name": "outputFields",
        "baseName": "outputFields",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=CallbackCompletionBatchRequest.js.map