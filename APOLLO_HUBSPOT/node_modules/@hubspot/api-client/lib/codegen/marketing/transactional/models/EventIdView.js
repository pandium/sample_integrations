"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventIdView = void 0;
class EventIdView {
    static getAttributeTypeMap() {
        return EventIdView.attributeTypeMap;
    }
    constructor() {
    }
}
exports.EventIdView = EventIdView;
EventIdView.discriminator = undefined;
EventIdView.attributeTypeMap = [
    {
        "name": "created",
        "baseName": "created",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": "uuid"
    }
];
//# sourceMappingURL=EventIdView.js.map