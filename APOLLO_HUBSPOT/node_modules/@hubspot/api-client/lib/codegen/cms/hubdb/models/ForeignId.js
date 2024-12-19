"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignId = void 0;
class ForeignId {
    static getAttributeTypeMap() {
        return ForeignId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ForeignId = ForeignId;
ForeignId.discriminator = undefined;
ForeignId.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ForeignId.js.map