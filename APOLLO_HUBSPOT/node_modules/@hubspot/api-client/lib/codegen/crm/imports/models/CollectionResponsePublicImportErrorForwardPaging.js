"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicImportErrorForwardPaging = void 0;
class CollectionResponsePublicImportErrorForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicImportErrorForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicImportErrorForwardPaging = CollectionResponsePublicImportErrorForwardPaging;
CollectionResponsePublicImportErrorForwardPaging.discriminator = undefined;
CollectionResponsePublicImportErrorForwardPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicImportError>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicImportErrorForwardPaging.js.map