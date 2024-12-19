"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderUpdateTaskLocator = void 0;
class FolderUpdateTaskLocator {
    static getAttributeTypeMap() {
        return FolderUpdateTaskLocator.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FolderUpdateTaskLocator = FolderUpdateTaskLocator;
FolderUpdateTaskLocator.discriminator = undefined;
FolderUpdateTaskLocator.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "links",
        "baseName": "links",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=FolderUpdateTaskLocator.js.map