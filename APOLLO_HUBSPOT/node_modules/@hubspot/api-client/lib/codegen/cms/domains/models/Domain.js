"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domain = void 0;
class Domain {
    static getAttributeTypeMap() {
        return Domain.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Domain = Domain;
Domain.discriminator = undefined;
Domain.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "domain",
        "baseName": "domain",
        "type": "string",
        "format": ""
    },
    {
        "name": "primaryLandingPage",
        "baseName": "primaryLandingPage",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "primaryEmail",
        "baseName": "primaryEmail",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "primaryBlogPost",
        "baseName": "primaryBlogPost",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "primarySitePage",
        "baseName": "primarySitePage",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "primaryKnowledge",
        "baseName": "primaryKnowledge",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "secondaryToDomain",
        "baseName": "secondaryToDomain",
        "type": "string",
        "format": ""
    },
    {
        "name": "isResolving",
        "baseName": "isResolving",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "manuallyMarkedAsResolving",
        "baseName": "manuallyMarkedAsResolving",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isSslEnabled",
        "baseName": "isSslEnabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isSslOnly",
        "baseName": "isSslOnly",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isUsedForBlogPost",
        "baseName": "isUsedForBlogPost",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isUsedForSitePage",
        "baseName": "isUsedForSitePage",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isUsedForLandingPage",
        "baseName": "isUsedForLandingPage",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isUsedForEmail",
        "baseName": "isUsedForEmail",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "isUsedForKnowledge",
        "baseName": "isUsedForKnowledge",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "correctCname",
        "baseName": "correctCname",
        "type": "string",
        "format": ""
    },
    {
        "name": "created",
        "baseName": "created",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updated",
        "baseName": "updated",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=Domain.js.map