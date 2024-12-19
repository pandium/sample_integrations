"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueWithTimestamp = void 0;
class ValueWithTimestamp {
    static getAttributeTypeMap() {
        return ValueWithTimestamp.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ValueWithTimestamp = ValueWithTimestamp;
ValueWithTimestamp.discriminator = undefined;
ValueWithTimestamp.attributeTypeMap = [
    {
        "name": "sourceId",
        "baseName": "sourceId",
        "type": "string",
        "format": ""
    },
    {
        "name": "sourceType",
        "baseName": "sourceType",
        "type": "string",
        "format": ""
    },
    {
        "name": "sourceLabel",
        "baseName": "sourceLabel",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedByUserId",
        "baseName": "updatedByUserId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "value",
        "baseName": "value",
        "type": "string",
        "format": ""
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=ValueWithTimestamp.js.map