"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicPermissionSetNoPaging = void 0;
class CollectionResponsePublicPermissionSetNoPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicPermissionSetNoPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicPermissionSetNoPaging = CollectionResponsePublicPermissionSetNoPaging;
CollectionResponsePublicPermissionSetNoPaging.discriminator = undefined;
CollectionResponsePublicPermissionSetNoPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicPermissionSet>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicPermissionSetNoPaging.js.map