"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicTeamNoPaging = void 0;
class CollectionResponsePublicTeamNoPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicTeamNoPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicTeamNoPaging = CollectionResponsePublicTeamNoPaging;
CollectionResponsePublicTeamNoPaging.discriminator = undefined;
CollectionResponsePublicTeamNoPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicTeam>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicTeamNoPaging.js.map