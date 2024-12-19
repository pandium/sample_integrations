"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundImage = void 0;
class BackgroundImage {
    static getAttributeTypeMap() {
        return BackgroundImage.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BackgroundImage = BackgroundImage;
BackgroundImage.discriminator = undefined;
BackgroundImage.attributeTypeMap = [
    {
        "name": "imageUrl",
        "baseName": "imageUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "backgroundSize",
        "baseName": "backgroundSize",
        "type": "string",
        "format": ""
    },
    {
        "name": "backgroundPosition",
        "baseName": "backgroundPosition",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=BackgroundImage.js.map