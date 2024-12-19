"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRowCore = void 0;
class ImportRowCore {
    static getAttributeTypeMap() {
        return ImportRowCore.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ImportRowCore = ImportRowCore;
ImportRowCore.discriminator = undefined;
ImportRowCore.attributeTypeMap = [
    {
        "name": "lineNumber",
        "baseName": "lineNumber",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "rowData",
        "baseName": "rowData",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "fileId",
        "baseName": "fileId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "pageName",
        "baseName": "pageName",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ImportRowCore.js.map