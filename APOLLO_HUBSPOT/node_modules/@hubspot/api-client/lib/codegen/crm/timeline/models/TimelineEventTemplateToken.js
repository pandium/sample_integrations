"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventTemplateToken = void 0;
class TimelineEventTemplateToken {
    static getAttributeTypeMap() {
        return TimelineEventTemplateToken.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEventTemplateToken = TimelineEventTemplateToken;
TimelineEventTemplateToken.discriminator = undefined;
TimelineEventTemplateToken.attributeTypeMap = [
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
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "TimelineEventTemplateTokenTypeEnum",
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
//# sourceMappingURL=TimelineEventTemplateToken.js.map