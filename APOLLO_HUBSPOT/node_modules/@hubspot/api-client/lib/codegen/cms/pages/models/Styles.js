"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Styles = void 0;
class Styles {
    static getAttributeTypeMap() {
        return Styles.attributeTypeMap;
    }
    constructor() {
    }
}
exports.Styles = Styles;
Styles.discriminator = undefined;
Styles.attributeTypeMap = [
    {
        "name": "backgroundColor",
        "baseName": "backgroundColor",
        "type": "RGBAColor",
        "format": ""
    },
    {
        "name": "flexboxPositioning",
        "baseName": "flexboxPositioning",
        "type": "string",
        "format": ""
    },
    {
        "name": "backgroundImage",
        "baseName": "backgroundImage",
        "type": "BackgroundImage",
        "format": ""
    },
    {
        "name": "forceFullWidthSection",
        "baseName": "forceFullWidthSection",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "verticalAlignment",
        "baseName": "verticalAlignment",
        "type": "string",
        "format": ""
    },
    {
        "name": "maxWidthSectionCentering",
        "baseName": "maxWidthSectionCentering",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "backgroundGradient",
        "baseName": "backgroundGradient",
        "type": "Gradient",
        "format": ""
    }
];
//# sourceMappingURL=Styles.js.map