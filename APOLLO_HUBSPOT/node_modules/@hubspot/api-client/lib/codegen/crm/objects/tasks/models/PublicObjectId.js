"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicObjectId = void 0;
class PublicObjectId {
    static getAttributeTypeMap() {
        return PublicObjectId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicObjectId = PublicObjectId;
PublicObjectId.discriminator = undefined;
PublicObjectId.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicObjectId.js.map