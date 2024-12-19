"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDefinition = void 0;
class SubscriptionDefinition {
    static getAttributeTypeMap() {
        return SubscriptionDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SubscriptionDefinition = SubscriptionDefinition;
SubscriptionDefinition.discriminator = undefined;
SubscriptionDefinition.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "purpose",
        "baseName": "purpose",
        "type": "string",
        "format": ""
    },
    {
        "name": "communicationMethod",
        "baseName": "communicationMethod",
        "type": "string",
        "format": ""
    },
    {
        "name": "isActive",
        "baseName": "isActive",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isDefault",
        "baseName": "isDefault",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isInternal",
        "baseName": "isInternal",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=SubscriptionDefinition.js.map