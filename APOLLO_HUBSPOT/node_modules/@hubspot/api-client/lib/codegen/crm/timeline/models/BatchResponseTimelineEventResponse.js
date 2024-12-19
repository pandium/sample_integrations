"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseTimelineEventResponse = void 0;
class BatchResponseTimelineEventResponse {
    static getAttributeTypeMap() {
        return BatchResponseTimelineEventResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseTimelineEventResponse = BatchResponseTimelineEventResponse;
BatchResponseTimelineEventResponse.discriminator = undefined;
BatchResponseTimelineEventResponse.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseTimelineEventResponseStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<TimelineEventResponse>",
        "format": ""
    },
    {
        "name": "requestedAt",
        "baseName": "requestedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "startedAt",
        "baseName": "startedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "completedAt",
        "baseName": "completedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "links",
        "baseName": "links",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=BatchResponseTimelineEventResponse.js.map