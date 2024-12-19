"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePublicObjectId = void 0;
class SimplePublicObjectId {
    static getAttributeTypeMap() {
        return SimplePublicObjectId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SimplePublicObjectId = SimplePublicObjectId;
SimplePublicObjectId.discriminator = undefined;
SimplePublicObjectId.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=SimplePublicObjectId.js.map