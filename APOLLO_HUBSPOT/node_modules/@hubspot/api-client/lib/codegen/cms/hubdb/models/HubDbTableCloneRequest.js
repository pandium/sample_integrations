"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubDbTableCloneRequest = void 0;
class HubDbTableCloneRequest {
    static getAttributeTypeMap() {
        return HubDbTableCloneRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.HubDbTableCloneRequest = HubDbTableCloneRequest;
HubDbTableCloneRequest.discriminator = undefined;
HubDbTableCloneRequest.attributeTypeMap = [
    {
        "name": "newName",
        "baseName": "newName",
        "type": "string",
        "format": ""
    },
    {
        "name": "newLabel",
        "baseName": "newLabel",
        "type": "string",
        "format": ""
    },
    {
        "name": "copyRows",
        "baseName": "copyRows",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=HubDbTableCloneRequest.js.map