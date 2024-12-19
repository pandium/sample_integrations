"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAssociationMultiArchive = void 0;
class PublicAssociationMultiArchive {
    static getAttributeTypeMap() {
        return PublicAssociationMultiArchive.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAssociationMultiArchive = PublicAssociationMultiArchive;
PublicAssociationMultiArchive.discriminator = undefined;
PublicAssociationMultiArchive.attributeTypeMap = [
    {
        "name": "_from",
        "baseName": "from",
        "type": "PublicObjectId",
        "format": ""
    },
    {
        "name": "to",
        "baseName": "to",
        "type": "Array<PublicObjectId>",
        "format": ""
    }
];
//# sourceMappingURL=PublicAssociationMultiArchive.js.map