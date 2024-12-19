"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRequest = void 0;
class SettingsRequest {
    static getAttributeTypeMap() {
        return SettingsRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SettingsRequest = SettingsRequest;
SettingsRequest.discriminator = undefined;
SettingsRequest.attributeTypeMap = [
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
    }
];
//# sourceMappingURL=SettingsRequest.js.map