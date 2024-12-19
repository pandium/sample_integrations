"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordingSettingsResponse = void 0;
class RecordingSettingsResponse {
    static getAttributeTypeMap() {
        return RecordingSettingsResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.RecordingSettingsResponse = RecordingSettingsResponse;
RecordingSettingsResponse.discriminator = undefined;
RecordingSettingsResponse.attributeTypeMap = [
    {
        "name": "urlToRetrieveAuthedRecording",
        "baseName": "urlToRetrieveAuthedRecording",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=RecordingSettingsResponse.js.map