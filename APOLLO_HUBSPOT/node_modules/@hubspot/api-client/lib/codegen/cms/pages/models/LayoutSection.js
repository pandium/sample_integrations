"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutSection = void 0;
class LayoutSection {
    static getAttributeTypeMap() {
        return LayoutSection.attributeTypeMap;
    }
    constructor() {
    }
}
exports.LayoutSection = LayoutSection;
LayoutSection.discriminator = undefined;
LayoutSection.attributeTypeMap = [
    {
        "name": "cssStyle",
        "baseName": "cssStyle",
        "type": "string",
        "format": ""
    },
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "string",
        "format": ""
    },
    {
        "name": "params",
        "baseName": "params",
        "type": "{ [key: string]: any; }",
        "format": ""
    },
    {
        "name": "rows",
        "baseName": "rows",
        "type": "Array<{ [key: string]: LayoutSection; }>",
        "format": ""
    },
    {
        "name": "rowMetaData",
        "baseName": "rowMetaData",
        "type": "Array<RowMetaData>",
        "format": ""
    },
    {
        "name": "cells",
        "baseName": "cells",
        "type": "Array<LayoutSection>",
        "format": ""
    },
    {
        "name": "cssClass",
        "baseName": "cssClass",
        "type": "string",
        "format": ""
    },
    {
        "name": "w",
        "baseName": "w",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "cssId",
        "baseName": "cssId",
        "type": "string",
        "format": ""
    },
    {
        "name": "x",
        "baseName": "x",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "styles",
        "baseName": "styles",
        "type": "Styles",
        "format": ""
    }
];
//# sourceMappingURL=LayoutSection.js.map