"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleUser = void 0;
class SimpleUser {
    static getAttributeTypeMap() {
        return SimpleUser.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SimpleUser = SimpleUser;
SimpleUser.discriminator = undefined;
SimpleUser.attributeTypeMap = [
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
    }
];
//# sourceMappingURL=SimpleUser.js.map