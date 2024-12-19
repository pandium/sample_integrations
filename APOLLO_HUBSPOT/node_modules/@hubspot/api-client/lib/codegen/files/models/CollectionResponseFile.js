"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseFile = void 0;
class CollectionResponseFile {
    static getAttributeTypeMap() {
        return CollectionResponseFile.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseFile = CollectionResponseFile;
CollectionResponseFile.discriminator = undefined;
CollectionResponseFile.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<any>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseFile.js.map