"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputPublicDefaultAssociationMultiPost = void 0;
class BatchInputPublicDefaultAssociationMultiPost {
    static getAttributeTypeMap() {
        return BatchInputPublicDefaultAssociationMultiPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputPublicDefaultAssociationMultiPost = BatchInputPublicDefaultAssociationMultiPost;
BatchInputPublicDefaultAssociationMultiPost.discriminator = undefined;
BatchInputPublicDefaultAssociationMultiPost.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PublicDefaultAssociationMultiPost>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputPublicDefaultAssociationMultiPost.js.map