"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorStop = void 0;
class ColorStop {
    static getAttributeTypeMap() {
        return ColorStop.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ColorStop = ColorStop;
ColorStop.discriminator = undefined;
ColorStop.attributeTypeMap = [
    {
        "name": "color",
        "baseName": "color",
        "type": "RGBAColor",
        "format": ""
    }
];
//# sourceMappingURL=ColorStop.js.map