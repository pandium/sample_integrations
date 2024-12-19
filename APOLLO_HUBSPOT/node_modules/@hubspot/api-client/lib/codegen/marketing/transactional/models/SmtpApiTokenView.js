"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpApiTokenView = void 0;
class SmtpApiTokenView {
    static getAttributeTypeMap() {
        return SmtpApiTokenView.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SmtpApiTokenView = SmtpApiTokenView;
SmtpApiTokenView.discriminator = undefined;
SmtpApiTokenView.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "createdBy",
        "baseName": "createdBy",
        "type": "string",
        "format": ""
    },
    {
        "name": "password",
        "baseName": "password",
        "type": "string",
        "format": ""
    },
    {
        "name": "emailCampaignId",
        "baseName": "emailCampaignId",
        "type": "string",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "createContact",
        "baseName": "createContact",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "campaignName",
        "baseName": "campaignName",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=SmtpApiTokenView.js.map