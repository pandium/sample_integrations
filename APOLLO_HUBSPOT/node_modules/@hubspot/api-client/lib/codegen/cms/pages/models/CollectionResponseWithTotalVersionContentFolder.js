"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalVersionContentFolder = void 0;
class CollectionResponseWithTotalVersionContentFolder {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalVersionContentFolder.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalVersionContentFolder = CollectionResponseWithTotalVersionContentFolder;
CollectionResponseWithTotalVersionContentFolder.discriminator = undefined;
CollectionResponseWithTotalVersionContentFolder.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<VersionContentFolder>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalVersionContentFolder.js.map