"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderInput = void 0;
class FolderInput {
    static getAttributeTypeMap() {
        return FolderInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FolderInput = FolderInput;
FolderInput.discriminator = undefined;
FolderInput.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "parentFolderId",
        "baseName": "parentFolderId",
        "type": "string",
        "format": ""
    },
    {
        "name": "parentPath",
        "baseName": "parentPath",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=FolderInput.js.map