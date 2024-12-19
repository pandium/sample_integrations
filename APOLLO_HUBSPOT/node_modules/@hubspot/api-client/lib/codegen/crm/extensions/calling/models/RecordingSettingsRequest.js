"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordingSettingsRequest = void 0;
class RecordingSettingsRequest {
    static getAttributeTypeMap() {
        return RecordingSettingsRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.RecordingSettingsRequest = RecordingSettingsRequest;
RecordingSettingsRequest.discriminator = undefined;
RecordingSettingsRequest.attributeTypeMap = [
    {
        "name": "urlToRetrieveAuthedRecording",
        "baseName": "urlToRetrieveAuthedRecording",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=RecordingSettingsRequest.js.map