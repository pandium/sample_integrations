"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentScheduleRequestVNext = void 0;
class ContentScheduleRequestVNext {
    static getAttributeTypeMap() {
        return ContentScheduleRequestVNext.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ContentScheduleRequestVNext = ContentScheduleRequestVNext;
ContentScheduleRequestVNext.discriminator = undefined;
ContentScheduleRequestVNext.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "publishDate",
        "baseName": "publishDate",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=ContentScheduleRequestVNext.js.map