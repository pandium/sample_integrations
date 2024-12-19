"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberEmailResponse = void 0;
class SubscriberEmailResponse {
    static getAttributeTypeMap() {
        return SubscriberEmailResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriberEmailResponse = SubscriberEmailResponse;
SubscriberEmailResponse.discriminator = undefined;
SubscriberEmailResponse.attributeTypeMap = [
    {
        "name": "vid",
        "baseName": "vid",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "email",
        "baseName": "email",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=SubscriberEmailResponse.js.map