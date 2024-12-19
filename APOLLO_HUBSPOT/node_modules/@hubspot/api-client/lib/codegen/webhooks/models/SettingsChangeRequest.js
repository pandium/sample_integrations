"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsChangeRequest = void 0;
class SettingsChangeRequest {
    static getAttributeTypeMap() {
        return SettingsChangeRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SettingsChangeRequest = SettingsChangeRequest;
SettingsChangeRequest.discriminator = undefined;
SettingsChangeRequest.attributeTypeMap = [
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
    }
];
//# sourceMappingURL=SettingsChangeRequest.js.map