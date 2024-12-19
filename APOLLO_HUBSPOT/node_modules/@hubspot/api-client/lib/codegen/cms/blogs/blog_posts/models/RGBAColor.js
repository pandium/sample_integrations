"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGBAColor = void 0;
class RGBAColor {
    static getAttributeTypeMap() {
        return RGBAColor.attributeTypeMap;
    }
    constructor() {
    }
}
exports.RGBAColor = RGBAColor;
RGBAColor.discriminator = undefined;
RGBAColor.attributeTypeMap = [
    {
        "name": "r",
        "baseName": "r",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "g",
        "baseName": "g",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "b",
        "baseName": "b",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "a",
        "baseName": "a",
        "type": "number",
        "format": ""
    }
];
//# sourceMappingURL=RGBAColor.js.map