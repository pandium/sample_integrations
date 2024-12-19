"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputCallbackCompletionBatchRequest = void 0;
class BatchInputCallbackCompletionBatchRequest {
    static getAttributeTypeMap() {
        return BatchInputCallbackCompletionBatchRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputCallbackCompletionBatchRequest = BatchInputCallbackCompletionBatchRequest;
BatchInputCallbackCompletionBatchRequest.discriminator = undefined;
BatchInputCallbackCompletionBatchRequest.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<CallbackCompletionBatchRequest>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputCallbackCompletionBatchRequest.js.map