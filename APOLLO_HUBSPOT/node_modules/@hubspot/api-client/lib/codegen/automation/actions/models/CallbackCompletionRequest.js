"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackCompletionRequest = void 0;
class CallbackCompletionRequest {
    static getAttributeTypeMap() {
        return CallbackCompletionRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CallbackCompletionRequest = CallbackCompletionRequest;
CallbackCompletionRequest.discriminator = undefined;
CallbackCompletionRequest.attributeTypeMap = [
    {
        "name": "outputFields",
        "baseName": "outputFields",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=CallbackCompletionRequest.js.map