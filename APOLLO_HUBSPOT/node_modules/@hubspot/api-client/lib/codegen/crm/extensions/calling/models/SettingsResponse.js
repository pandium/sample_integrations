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
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "string",
        "format": ""
    },
    {
        "name": "height",
        "baseName": "height",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "width",
        "baseName": "width",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "isReady",
        "baseName": "isReady",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "supportsCustomObjects",
        "baseName": "supportsCustomObjects",
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
//# sourceMappingURL=SettingsResponse.js.map