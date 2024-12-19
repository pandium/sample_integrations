"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicFetchAssociationsBatchRequest = void 0;
class PublicFetchAssociationsBatchRequest {
    static getAttributeTypeMap() {
        return PublicFetchAssociationsBatchRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicFetchAssociationsBatchRequest = PublicFetchAssociationsBatchRequest;
PublicFetchAssociationsBatchRequest.discriminator = undefined;
PublicFetchAssociationsBatchRequest.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "after",
        "baseName": "after",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicFetchAssociationsBatchRequest.js.map