"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicTeam = void 0;
class PublicTeam {
    static getAttributeTypeMap() {
        return PublicTeam.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicTeam = PublicTeam;
PublicTeam.discriminator = undefined;
PublicTeam.attributeTypeMap = [
    {
        "name": "userIds",
        "baseName": "userIds",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "secondaryUserIds",
        "baseName": "secondaryUserIds",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=PublicTeam.js.map