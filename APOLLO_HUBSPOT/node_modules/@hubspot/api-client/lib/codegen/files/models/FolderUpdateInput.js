"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderUpdateInput = void 0;
class FolderUpdateInput {
    static getAttributeTypeMap() {
        return FolderUpdateInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FolderUpdateInput = FolderUpdateInput;
FolderUpdateInput.discriminator = undefined;
FolderUpdateInput.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "parentFolderId",
        "baseName": "parentFolderId",
        "type": "number",
        "format": "int64"
    }
];
//# sourceMappingURL=FolderUpdateInput.js.map