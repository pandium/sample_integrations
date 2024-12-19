"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUpdateSubscriptionStatusRequest = void 0;
class PublicUpdateSubscriptionStatusRequest {
    static getAttributeTypeMap() {
        return PublicUpdateSubscriptionStatusRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicUpdateSubscriptionStatusRequest = PublicUpdateSubscriptionStatusRequest;
PublicUpdateSubscriptionStatusRequest.discriminator = undefined;
PublicUpdateSubscriptionStatusRequest.attributeTypeMap = [
    {
        "name": "emailAddress",
        "baseName": "emailAddress",
        "type": "string",
        "format": ""
    },
    {
        "name": "subscriptionId",
        "baseName": "subscriptionId",
        "type": "string",
        "format": ""
    },
    {
        "name": "legalBasis",
        "baseName": "legalBasis",
        "type": "PublicUpdateSubscriptionStatusRequestLegalBasisEnum",
        "format": ""
    },
    {
        "name": "legalBasisExplanation",
        "baseName": "legalBasisExplanation",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicUpdateSubscriptionStatusRequest.js.map