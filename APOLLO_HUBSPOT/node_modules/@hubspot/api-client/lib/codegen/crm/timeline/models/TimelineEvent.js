"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEvent = void 0;
class TimelineEvent {
    static getAttributeTypeMap() {
        return TimelineEvent.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEvent = TimelineEvent;
TimelineEvent.discriminator = undefined;
TimelineEvent.attributeTypeMap = [
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
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=TimelineEvent.js.map