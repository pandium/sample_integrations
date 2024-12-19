"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventTemplateUpdateRequest = void 0;
class TimelineEventTemplateUpdateRequest {
    static getAttributeTypeMap() {
        return TimelineEventTemplateUpdateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEventTemplateUpdateRequest = TimelineEventTemplateUpdateRequest;
TimelineEventTemplateUpdateRequest.discriminator = undefined;
TimelineEventTemplateUpdateRequest.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "headerTemplate",
        "baseName": "headerTemplate",
        "type": "string",
        "format": ""
    },
    {
        "name": "detailTemplate",
        "baseName": "detailTemplate",
        "type": "string",
        "format": ""
    },
    {
        "name": "tokens",
        "baseName": "tokens",
        "type": "Array<TimelineEventTemplateToken>",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=TimelineEventTemplateUpdateRequest.js.map