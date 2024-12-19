"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputPublicFetchAssociationsBatchRequest = void 0;
class BatchInputPublicFetchAssociationsBatchRequest {
    static getAttributeTypeMap() {
        return BatchInputPublicFetchAssociationsBatchRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputPublicFetchAssociationsBatchRequest = BatchInputPublicFetchAssociationsBatchRequest;
BatchInputPublicFetchAssociationsBatchRequest.discriminator = undefined;
BatchInputPublicFetchAssociationsBatchRequest.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PublicFetchAssociationsBatchRequest>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputPublicFetchAssociationsBatchRequest.js.map