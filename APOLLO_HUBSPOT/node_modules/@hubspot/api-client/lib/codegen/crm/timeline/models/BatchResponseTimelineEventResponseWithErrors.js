"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseTimelineEventResponseWithErrors = void 0;
class BatchResponseTimelineEventResponseWithErrors {
    static getAttributeTypeMap() {
        return BatchResponseTimelineEventResponseWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseTimelineEventResponseWithErrors = BatchResponseTimelineEventResponseWithErrors;
BatchResponseTimelineEventResponseWithErrors.discriminator = undefined;
BatchResponseTimelineEventResponseWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseTimelineEventResponseWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<TimelineEventResponse>",
        "format": ""
    },
    {
        "name": "numErrors",
        "baseName": "numErrors",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "errors",
        "baseName": "errors",
        "type": "Array<StandardError>",
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
//# sourceMappingURL=BatchResponseTimelineEventResponseWithErrors.js.map