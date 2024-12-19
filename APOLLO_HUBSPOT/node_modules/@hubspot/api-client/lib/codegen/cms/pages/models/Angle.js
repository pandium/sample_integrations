"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angle = void 0;
class Angle {
    static getAttributeTypeMap() {
        return Angle.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Angle = Angle;
Angle.discriminator = undefined;
Angle.attributeTypeMap = [
    {
        "name": "units",
        "baseName": "units",
        "type": "string",
        "format": ""
    },
    {
        "name": "value",
        "baseName": "value",
        "type": "number",
        "format": ""
    }
];
//# sourceMappingURL=Angle.js.map