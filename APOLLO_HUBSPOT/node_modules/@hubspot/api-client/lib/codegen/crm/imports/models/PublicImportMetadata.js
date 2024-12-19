"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicImportMetadata = void 0;
class PublicImportMetadata {
    static getAttributeTypeMap() {
        return PublicImportMetadata.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicImportMetadata = PublicImportMetadata;
PublicImportMetadata.discriminator = undefined;
PublicImportMetadata.attributeTypeMap = [
    {
        "name": "objectLists",
        "baseName": "objectLists",
        "type": "Array<PublicObjectListRecord>",
        "format": ""
    },
    {
        "name": "counters",
        "baseName": "counters",
        "type": "{ [key: string]: number; }",
        "format": "int32"
    },
    {
        "name": "fileIds",
        "baseName": "fileIds",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=PublicImportMetadata.js.map