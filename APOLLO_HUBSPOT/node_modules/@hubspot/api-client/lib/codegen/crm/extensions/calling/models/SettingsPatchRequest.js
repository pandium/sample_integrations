"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsPatchRequest = void 0;
class SettingsPatchRequest {
    static getAttributeTypeMap() {
        return SettingsPatchRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SettingsPatchRequest = SettingsPatchRequest;
SettingsPatchRequest.discriminator = undefined;
SettingsPatchRequest.attributeTypeMap = [
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
//# sourceMappingURL=SettingsPatchRequest.js.map