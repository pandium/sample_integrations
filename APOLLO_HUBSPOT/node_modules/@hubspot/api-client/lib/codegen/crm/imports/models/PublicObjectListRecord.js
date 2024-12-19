"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicObjectListRecord = void 0;
class PublicObjectListRecord {
    static getAttributeTypeMap() {
        return PublicObjectListRecord.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicObjectListRecord = PublicObjectListRecord;
PublicObjectListRecord.discriminator = undefined;
PublicObjectListRecord.attributeTypeMap = [
    {
        "name": "listId",
        "baseName": "listId",
        "type": "string",
        "format": ""
    },
    {
        "name": "objectType",
        "baseName": "objectType",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicObjectListRecord.js.map