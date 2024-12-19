"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingAppSettings = void 0;
class AccountingAppSettings {
    static getAttributeTypeMap() {
        return AccountingAppSettings.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AccountingAppSettings = AccountingAppSettings;
AccountingAppSettings.discriminator = undefined;
AccountingAppSettings.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "urls",
        "baseName": "urls",
        "type": "AccountingAppUrls",
        "format": ""
    },
    {
        "name": "features",
        "baseName": "features",
        "type": "AccountingFeatures",
        "format": ""
    }
];
//# sourceMappingURL=AccountingAppSettings.js.map