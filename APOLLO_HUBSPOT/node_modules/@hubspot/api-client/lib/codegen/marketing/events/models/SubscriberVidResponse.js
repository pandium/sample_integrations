"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberVidResponse = void 0;
class SubscriberVidResponse {
    static getAttributeTypeMap() {
        return SubscriberVidResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriberVidResponse = SubscriberVidResponse;
SubscriberVidResponse.discriminator = undefined;
SubscriberVidResponse.attributeTypeMap = [
    {
        "name": "vid",
        "baseName": "vid",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=SubscriberVidResponse.js.map