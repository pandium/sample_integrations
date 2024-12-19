"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpApiTokenRequestEgg = void 0;
class SmtpApiTokenRequestEgg {
    static getAttributeTypeMap() {
        return SmtpApiTokenRequestEgg.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SmtpApiTokenRequestEgg = SmtpApiTokenRequestEgg;
SmtpApiTokenRequestEgg.discriminator = undefined;
SmtpApiTokenRequestEgg.attributeTypeMap = [
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
//# sourceMappingURL=SmtpApiTokenRequestEgg.js.map