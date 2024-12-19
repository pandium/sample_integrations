"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAssociationMultiPost = void 0;
class PublicAssociationMultiPost {
    static getAttributeTypeMap() {
        return PublicAssociationMultiPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAssociationMultiPost = PublicAssociationMultiPost;
PublicAssociationMultiPost.discriminator = undefined;
PublicAssociationMultiPost.attributeTypeMap = [
    {
        "name": "types",
        "baseName": "types",
        "type": "Array<AssociationSpec>",
        "format": ""
    },
    {
        "name": "_from",
        "baseName": "from",
        "type": "PublicObjectId",
        "format": ""
    },
    {
        "name": "to",
        "baseName": "to",
        "type": "PublicObjectId",
        "format": ""
    }
];
//# sourceMappingURL=PublicAssociationMultiPost.js.map