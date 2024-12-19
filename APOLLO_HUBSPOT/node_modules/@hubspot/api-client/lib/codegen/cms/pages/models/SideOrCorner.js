"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideOrCorner = void 0;
class SideOrCorner {
    static getAttributeTypeMap() {
        return SideOrCorner.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SideOrCorner = SideOrCorner;
SideOrCorner.discriminator = undefined;
SideOrCorner.attributeTypeMap = [
    {
        "name": "horizontalSide",
        "baseName": "horizontalSide",
        "type": "string",
        "format": ""
    },
    {
        "name": "verticalSide",
        "baseName": "verticalSide",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=SideOrCorner.js.map