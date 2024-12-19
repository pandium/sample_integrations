"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalSettings = void 0;
class ExternalSettings {
    static getAttributeTypeMap() {
        return ExternalSettings.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ExternalSettings = ExternalSettings;
ExternalSettings.discriminator = undefined;
ExternalSettings.attributeTypeMap = [
    {
        "name": "createMeetingUrl",
        "baseName": "createMeetingUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "updateMeetingUrl",
        "baseName": "updateMeetingUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "deleteMeetingUrl",
        "baseName": "deleteMeetingUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "userVerifyUrl",
        "baseName": "userVerifyUrl",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ExternalSettings.js.map