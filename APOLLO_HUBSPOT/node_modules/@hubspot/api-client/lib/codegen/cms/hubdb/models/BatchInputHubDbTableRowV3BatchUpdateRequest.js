"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputHubDbTableRowV3BatchUpdateRequest = void 0;
class BatchInputHubDbTableRowV3BatchUpdateRequest {
    static getAttributeTypeMap() {
        return BatchInputHubDbTableRowV3BatchUpdateRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputHubDbTableRowV3BatchUpdateRequest = BatchInputHubDbTableRowV3BatchUpdateRequest;
BatchInputHubDbTableRowV3BatchUpdateRequest.discriminator = undefined;
BatchInputHubDbTableRowV3BatchUpdateRequest.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<HubDbTableRowV3BatchUpdateRequest>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputHubDbTableRowV3BatchUpdateRequest.js.map