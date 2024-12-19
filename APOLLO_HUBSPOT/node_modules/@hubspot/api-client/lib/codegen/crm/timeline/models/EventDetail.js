"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDetail = void 0;
class EventDetail {
    static getAttributeTypeMap() {
        return EventDetail.attributeTypeMap;
    }
    constructor() {
    }
}
exports.EventDetail = EventDetail;
EventDetail.discriminator = undefined;
EventDetail.attributeTypeMap = [
    {
        "name": "details",
        "baseName": "details",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=EventDetail.js.map