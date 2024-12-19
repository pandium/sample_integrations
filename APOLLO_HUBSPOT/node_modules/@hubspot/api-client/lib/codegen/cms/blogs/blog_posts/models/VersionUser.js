"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionUser = void 0;
class VersionUser {
    static getAttributeTypeMap() {
        return VersionUser.attributeTypeMap;
    }
    constructor() {
    }
}
exports.VersionUser = VersionUser;
VersionUser.discriminator = undefined;
VersionUser.attributeTypeMap = [
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
        "name": "fullName",
        "baseName": "fullName",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=VersionUser.js.map