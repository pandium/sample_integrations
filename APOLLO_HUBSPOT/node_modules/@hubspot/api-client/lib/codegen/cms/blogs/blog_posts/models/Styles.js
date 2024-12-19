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
        "name": "verticalAlignment",
        "baseName": "verticalAlignment",
        "type": "StylesVerticalAlignmentEnum",
        "format": ""
    },
    {
        "name": "backgroundColor",
        "baseName": "backgroundColor",
        "type": "RGBAColor",
        "format": ""
    },
    {
        "name": "backgroundImage",
        "baseName": "backgroundImage",
        "type": "BackgroundImage",
        "format": ""
    },
    {
        "name": "backgroundGradient",
        "baseName": "backgroundGradient",
        "type": "Gradient",
        "format": ""
    },
    {
        "name": "maxWidthSectionCentering",
        "baseName": "maxWidthSectionCentering",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "forceFullWidthSection",
        "baseName": "forceFullWidthSection",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "flexboxPositioning",
        "baseName": "flexboxPositioning",
        "type": "StylesFlexboxPositioningEnum",
        "format": ""
    }
];
//# sourceMappingURL=Styles.js.map