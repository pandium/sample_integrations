"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionResponse = void 0;
class ActionResponse {
    static getAttributeTypeMap() {
        return ActionResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ActionResponse = ActionResponse;
ActionResponse.discriminator = undefined;
ActionResponse.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "ActionResponseStatusEnum",
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
//# sourceMappingURL=ActionResponse.js.map