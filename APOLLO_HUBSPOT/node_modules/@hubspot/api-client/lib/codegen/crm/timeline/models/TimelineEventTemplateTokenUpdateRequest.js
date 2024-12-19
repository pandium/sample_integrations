"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventTemplateTokenUpdateRequest = void 0;
class TimelineEventTemplateTokenUpdateRequest {
    static getAttributeTypeMap() {
        return TimelineEventTemplateTokenUpdateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEventTemplateTokenUpdateRequest = TimelineEventTemplateTokenUpdateRequest;
TimelineEventTemplateTokenUpdateRequest.discriminator = undefined;
TimelineEventTemplateTokenUpdateRequest.attributeTypeMap = [
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "objectPropertyName",
        "baseName": "objectPropertyName",
        "type": "string",
        "format": ""
    },
    {
        "name": "options",
        "baseName": "options",
        "type": "Array<TimelineEventTemplateTokenOption>",
        "format": ""
    }
];
//# sourceMappingURL=TimelineEventTemplateTokenUpdateRequest.js.map