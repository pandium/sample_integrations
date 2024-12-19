"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paging = void 0;
class Paging {
    static getAttributeTypeMap() {
        return Paging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Paging = Paging;
Paging.discriminator = undefined;
Paging.attributeTypeMap = [
    {
        "name": "next",
        "baseName": "next",
        "type": "NextPage",
        "format": ""
    },
    {
        "name": "prev",
        "baseName": "prev",
        "type": "PreviousPage",
        "format": ""
    }
];
//# sourceMappingURL=Paging.js.map