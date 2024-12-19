"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventTemplateCreateRequest = void 0;
class TimelineEventTemplateCreateRequest {
    static getAttributeTypeMap() {
        return TimelineEventTemplateCreateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEventTemplateCreateRequest = TimelineEventTemplateCreateRequest;
TimelineEventTemplateCreateRequest.discriminator = undefined;
TimelineEventTemplateCreateRequest.attributeTypeMap = [
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
        "name": "objectType",
        "baseName": "objectType",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=TimelineEventTemplateCreateRequest.js.map