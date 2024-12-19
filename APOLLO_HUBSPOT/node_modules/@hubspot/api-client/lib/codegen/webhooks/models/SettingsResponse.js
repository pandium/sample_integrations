"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsResponse = void 0;
class SettingsResponse {
    static getAttributeTypeMap() {
        return SettingsResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SettingsResponse = SettingsResponse;
SettingsResponse.discriminator = undefined;
SettingsResponse.attributeTypeMap = [
    {
        "name": "targetUrl",
        "baseName": "targetUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "throttling",
        "baseName": "throttling",
        "type": "ThrottlingSettings",
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
//# sourceMappingURL=SettingsResponse.js.map