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
        "name": "primary",
        "baseName": "primary",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=PublicTeam.js.map