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
        "name": "verticalSide",
        "baseName": "verticalSide",
        "type": "SideOrCornerVerticalSideEnum",
        "format": ""
    },
    {
        "name": "horizontalSide",
        "baseName": "horizontalSide",
        "type": "SideOrCornerHorizontalSideEnum",
        "format": ""
    }
];
//# sourceMappingURL=SideOrCorner.js.map