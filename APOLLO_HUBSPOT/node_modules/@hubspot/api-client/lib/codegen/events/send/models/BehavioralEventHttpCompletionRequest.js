"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehavioralEventHttpCompletionRequest = void 0;
class BehavioralEventHttpCompletionRequest {
    static getAttributeTypeMap() {
        return BehavioralEventHttpCompletionRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BehavioralEventHttpCompletionRequest = BehavioralEventHttpCompletionRequest;
BehavioralEventHttpCompletionRequest.discriminator = undefined;
BehavioralEventHttpCompletionRequest.attributeTypeMap = [
    {
        "name": "occurredAt",
        "baseName": "occurredAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "eventName",
        "baseName": "eventName",
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
        "name": "uuid",
        "baseName": "uuid",
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
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "objectId",
        "baseName": "objectId",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=BehavioralEventHttpCompletionRequest.js.map