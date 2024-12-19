"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAssociationMulti = void 0;
class PublicAssociationMulti {
    static getAttributeTypeMap() {
        return PublicAssociationMulti.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAssociationMulti = PublicAssociationMulti;
PublicAssociationMulti.discriminator = undefined;
PublicAssociationMulti.attributeTypeMap = [
    {
        "name": "_from",
        "baseName": "from",
        "type": "PublicObjectId",
        "format": ""
    },
    {
        "name": "to",
        "baseName": "to",
        "type": "Array<AssociatedId>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=PublicAssociationMulti.js.map