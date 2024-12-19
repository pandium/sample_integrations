"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputPublicAssociationMultiPost = void 0;
class BatchInputPublicAssociationMultiPost {
    static getAttributeTypeMap() {
        return BatchInputPublicAssociationMultiPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputPublicAssociationMultiPost = BatchInputPublicAssociationMultiPost;
BatchInputPublicAssociationMultiPost.discriminator = undefined;
BatchInputPublicAssociationMultiPost.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PublicAssociationMultiPost>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputPublicAssociationMultiPost.js.map