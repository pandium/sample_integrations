"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicOwner = void 0;
class PublicOwner {
    static getAttributeTypeMap() {
        return PublicOwner.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicOwner = PublicOwner;
PublicOwner.discriminator = undefined;
PublicOwner.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "email",
        "baseName": "email",
        "type": "string",
        "format": ""
    },
    {
        "name": "firstName",
        "baseName": "firstName",
        "type": "string",
        "format": ""
    },
    {
        "name": "lastName",
        "baseName": "lastName",
        "type": "string",
        "format": ""
    },
    {
        "name": "userId",
        "baseName": "userId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "teams",
        "baseName": "teams",
        "type": "Array<PublicTeam>",
        "format": ""
    }
];
//# sourceMappingURL=PublicOwner.js.map