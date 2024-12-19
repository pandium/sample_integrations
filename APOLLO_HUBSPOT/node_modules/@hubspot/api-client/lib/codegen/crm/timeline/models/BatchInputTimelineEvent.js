"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputTimelineEvent = void 0;
class BatchInputTimelineEvent {
    static getAttributeTypeMap() {
        return BatchInputTimelineEvent.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputTimelineEvent = BatchInputTimelineEvent;
BatchInputTimelineEvent.discriminator = undefined;
BatchInputTimelineEvent.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<TimelineEvent>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputTimelineEvent.js.map