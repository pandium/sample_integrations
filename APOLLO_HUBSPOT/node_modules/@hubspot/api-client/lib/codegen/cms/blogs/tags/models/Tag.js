"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
class Tag {
    static getAttributeTypeMap() {
        return Tag.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Tag = Tag;
Tag.discriminator = undefined;
Tag.attributeTypeMap = [
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
        "name": "language",
        "baseName": "language",
        "type": "TagLanguageEnum",
        "format": ""
    },
    {
        "name": "translatedFromId",
        "baseName": "translatedFromId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "created",
        "baseName": "created",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updated",
        "baseName": "updated",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "deletedAt",
        "baseName": "deletedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=Tag.js.map