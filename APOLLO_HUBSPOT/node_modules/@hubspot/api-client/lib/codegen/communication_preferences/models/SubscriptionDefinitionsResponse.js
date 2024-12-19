"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDefinitionsResponse = void 0;
class SubscriptionDefinitionsResponse {
    static getAttributeTypeMap() {
        return SubscriptionDefinitionsResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriptionDefinitionsResponse = SubscriptionDefinitionsResponse;
SubscriptionDefinitionsResponse.discriminator = undefined;
SubscriptionDefinitionsResponse.attributeTypeMap = [
    {
        "name": "subscriptionDefinitions",
        "baseName": "subscriptionDefinitions",
        "type": "Array<SubscriptionDefinition>",
        "format": ""
    }
];
//# sourceMappingURL=SubscriptionDefinitionsResponse.js.map