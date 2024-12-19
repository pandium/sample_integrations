"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventIFrame = void 0;
class TimelineEventIFrame {
    static getAttributeTypeMap() {
        return TimelineEventIFrame.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TimelineEventIFrame = TimelineEventIFrame;
TimelineEventIFrame.discriminator = undefined;
TimelineEventIFrame.attributeTypeMap = [
    {
        "name": "linkLabel",
        "baseName": "linkLabel",
        "type": "string",
        "format": ""
    },
    {
        "name": "headerLabel",
        "baseName": "headerLabel",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "string",
        "format": ""
    },
    {
        "name": "width",
        "baseName": "width",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "height",
        "baseName": "height",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=TimelineEventIFrame.js.map