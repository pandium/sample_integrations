"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDetailSettings = void 0;
class EventDetailSettings {
    static getAttributeTypeMap() {
        return EventDetailSettings.attributeTypeMap;
    }
    constructor() {
    }
}
exports.EventDetailSettings = EventDetailSettings;
EventDetailSettings.discriminator = undefined;
EventDetailSettings.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "eventDetailsUrl",
        "baseName": "eventDetailsUrl",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=EventDetailSettings.js.map