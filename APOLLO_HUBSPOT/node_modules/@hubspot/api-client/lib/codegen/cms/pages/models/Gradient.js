"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gradient = void 0;
class Gradient {
    static getAttributeTypeMap() {
        return Gradient.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Gradient = Gradient;
Gradient.discriminator = undefined;
Gradient.attributeTypeMap = [
    {
        "name": "angle",
        "baseName": "angle",
        "type": "Angle",
        "format": ""
    },
    {
        "name": "sideOrCorner",
        "baseName": "sideOrCorner",
        "type": "SideOrCorner",
        "format": ""
    },
    {
        "name": "colors",
        "baseName": "colors",
        "type": "Array<ColorStop>",
        "format": ""
    }
];
//# sourceMappingURL=Gradient.js.map