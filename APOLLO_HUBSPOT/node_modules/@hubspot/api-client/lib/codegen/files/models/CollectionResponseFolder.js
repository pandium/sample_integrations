"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseFolder = void 0;
class CollectionResponseFolder {
    static getAttributeTypeMap() {
        return CollectionResponseFolder.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseFolder = CollectionResponseFolder;
CollectionResponseFolder.discriminator = undefined;
CollectionResponseFolder.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Folder>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseFolder.js.map