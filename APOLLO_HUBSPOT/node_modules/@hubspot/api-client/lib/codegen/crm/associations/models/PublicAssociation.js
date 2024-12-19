"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAssociation = void 0;
class PublicAssociation {
    static getAttributeTypeMap() {
        return PublicAssociation.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAssociation = PublicAssociation;
PublicAssociation.discriminator = undefined;
PublicAssociation.attributeTypeMap = [
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
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicAssociation.js.map