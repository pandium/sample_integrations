"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStat = void 0;
class FileStat {
    static getAttributeTypeMap() {
        return FileStat.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FileStat = FileStat;
FileStat.discriminator = undefined;
FileStat.attributeTypeMap = [
    {
        "name": "file",
        "baseName": "file",
        "type": "any",
        "format": ""
    },
    {
        "name": "folder",
        "baseName": "folder",
        "type": "Folder",
        "format": ""
    }
];
//# sourceMappingURL=FileStat.js.map