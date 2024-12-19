"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicDefaultAssociationMultiPost = void 0;
class PublicDefaultAssociationMultiPost {
    static getAttributeTypeMap() {
        return PublicDefaultAssociationMultiPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicDefaultAssociationMultiPost = PublicDefaultAssociationMultiPost;
PublicDefaultAssociationMultiPost.discriminator = undefined;
PublicDefaultAssociationMultiPost.attributeTypeMap = [
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
//# sourceMappingURL=PublicDefaultAssociationMultiPost.js.map