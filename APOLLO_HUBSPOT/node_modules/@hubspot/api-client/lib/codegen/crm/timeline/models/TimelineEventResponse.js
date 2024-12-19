"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventResponse = void 0;
class TimelineEventResponse {
    static getAttributeTypeMap() {
        return TimelineEventResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEventResponse = TimelineEventResponse;
TimelineEventResponse.discriminator = undefined;
TimelineEventResponse.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "eventTemplateId",
        "baseName": "eventTemplateId",
        "type": "string",
        "format": ""
    },
    {
        "name": "email",
        "baseName": "email",
        "type": "string",
        "format": ""
    },
    {
        "name": "objectId",
        "baseName": "objectId",
        "type": "string",
        "format": ""
    },
    {
        "name": "utk",
        "baseName": "utk",
        "type": "string",
        "format": ""
    },
    {
        "name": "domain",
        "baseName": "domain",
        "type": "string",
        "format": ""
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "tokens",
        "baseName": "tokens",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "extraData",
        "baseName": "extraData",
        "type": "any",
        "format": ""
    },
    {
        "name": "timelineIFrame",
        "baseName": "timelineIFrame",
        "type": "TimelineEventIFrame",
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
    }
];
//# sourceMappingURL=TimelineEventResponse.js.map