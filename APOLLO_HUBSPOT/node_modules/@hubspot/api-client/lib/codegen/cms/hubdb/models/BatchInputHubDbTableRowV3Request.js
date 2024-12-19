"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputHubDbTableRowV3Request = void 0;
class BatchInputHubDbTableRowV3Request {
    static getAttributeTypeMap() {
        return BatchInputHubDbTableRowV3Request.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputHubDbTableRowV3Request = BatchInputHubDbTableRowV3Request;
BatchInputHubDbTableRowV3Request.discriminator = undefined;
BatchInputHubDbTableRowV3Request.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<HubDbTableRowV3Request>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputHubDbTableRowV3Request.js.map