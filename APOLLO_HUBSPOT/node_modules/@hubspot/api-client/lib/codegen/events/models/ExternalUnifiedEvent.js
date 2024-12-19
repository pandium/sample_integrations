"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalUnifiedEvent = void 0;
class ExternalUnifiedEvent {
    static getAttributeTypeMap() {
        return ExternalUnifiedEvent.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ExternalUnifiedEvent = ExternalUnifiedEvent;
ExternalUnifiedEvent.discriminator = undefined;
ExternalUnifiedEvent.attributeTypeMap = [
    {
        "name": "objectType",
        "baseName": "objectType",
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
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    },
    {
        "name": "occurredAt",
        "baseName": "occurredAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=ExternalUnifiedEvent.js.map