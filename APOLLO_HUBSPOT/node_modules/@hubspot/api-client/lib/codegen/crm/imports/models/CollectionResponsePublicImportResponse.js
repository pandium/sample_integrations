"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicImportResponse = void 0;
class CollectionResponsePublicImportResponse {
    static getAttributeTypeMap() {
        return CollectionResponsePublicImportResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicImportResponse = CollectionResponsePublicImportResponse;
CollectionResponsePublicImportResponse.discriminator = undefined;
CollectionResponsePublicImportResponse.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicImportResponse>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicImportResponse.js.map