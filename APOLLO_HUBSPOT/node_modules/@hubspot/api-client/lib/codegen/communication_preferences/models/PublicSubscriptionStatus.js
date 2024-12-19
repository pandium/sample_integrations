"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSubscriptionStatus = void 0;
class PublicSubscriptionStatus {
    static getAttributeTypeMap() {
        return PublicSubscriptionStatus.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicSubscriptionStatus = PublicSubscriptionStatus;
PublicSubscriptionStatus.discriminator = undefined;
PublicSubscriptionStatus.attributeTypeMap = [
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
        "name": "status",
        "baseName": "status",
        "type": "PublicSubscriptionStatusStatusEnum",
        "format": ""
    },
    {
        "name": "sourceOfStatus",
        "baseName": "sourceOfStatus",
        "type": "PublicSubscriptionStatusSourceOfStatusEnum",
        "format": ""
    },
    {
        "name": "brandId",
        "baseName": "brandId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "preferenceGroupName",
        "baseName": "preferenceGroupName",
        "type": "string",
        "format": ""
    },
    {
        "name": "legalBasis",
        "baseName": "legalBasis",
        "type": "PublicSubscriptionStatusLegalBasisEnum",
        "format": ""
    },
    {
        "name": "legalBasisExplanation",
        "baseName": "legalBasisExplanation",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicSubscriptionStatus.js.map