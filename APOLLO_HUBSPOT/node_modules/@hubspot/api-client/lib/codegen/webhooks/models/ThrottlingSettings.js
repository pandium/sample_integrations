"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlingSettings = void 0;
class ThrottlingSettings {
    static getAttributeTypeMap() {
        return ThrottlingSettings.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ThrottlingSettings = ThrottlingSettings;
ThrottlingSettings.discriminator = undefined;
ThrottlingSettings.attributeTypeMap = [
    {
        "name": "maxConcurrentRequests",
        "baseName": "maxConcurrentRequests",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "period",
        "baseName": "period",
        "type": "ThrottlingSettingsPeriodEnum",
        "format": ""
    }
];
//# sourceMappingURL=ThrottlingSettings.js.map