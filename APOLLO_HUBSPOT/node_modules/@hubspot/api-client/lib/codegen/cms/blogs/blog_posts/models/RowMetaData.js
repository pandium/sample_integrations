"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowMetaData = void 0;
class RowMetaData {
    static getAttributeTypeMap() {
        return RowMetaData.attributeTypeMap;
    }
    constructor() {
    }
}
exports.RowMetaData = RowMetaData;
RowMetaData.discriminator = undefined;
RowMetaData.attributeTypeMap = [
    {
        "name": "styles",
        "baseName": "styles",
        "type": "Styles",
        "format": ""
    },
    {
        "name": "cssClass",
        "baseName": "cssClass",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=RowMetaData.js.map