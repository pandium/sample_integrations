"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventTemplate = void 0;
class TimelineEventTemplate {
    static getAttributeTypeMap() {
        return TimelineEventTemplate.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEventTemplate = TimelineEventTemplate;
TimelineEventTemplate.discriminator = undefined;
TimelineEventTemplate.attributeTypeMap = [
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
    },
    {
        "name": "objectType",
        "baseName": "objectType",
        "type": "string",
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
//# sourceMappingURL=TimelineEventTemplate.js.map