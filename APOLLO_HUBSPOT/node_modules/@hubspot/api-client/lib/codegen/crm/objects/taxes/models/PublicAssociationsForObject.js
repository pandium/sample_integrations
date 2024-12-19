"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAssociationsForObject = void 0;
class PublicAssociationsForObject {
    static getAttributeTypeMap() {
        return PublicAssociationsForObject.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicAssociationsForObject = PublicAssociationsForObject;
PublicAssociationsForObject.discriminator = undefined;
PublicAssociationsForObject.attributeTypeMap = [
    {
        "name": "types",
        "baseName": "types",
        "type": "Array<AssociationSpec>",
        "format": ""
    },
    {
        "name": "to",
        "baseName": "to",
        "type": "PublicObjectId",
        "format": ""
    }
];
//# sourceMappingURL=PublicAssociationsForObject.js.map