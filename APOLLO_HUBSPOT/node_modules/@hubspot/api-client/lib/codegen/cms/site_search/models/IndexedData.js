"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedData = void 0;
class IndexedData {
    static getAttributeTypeMap() {
        return IndexedData.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IndexedData = IndexedData;
IndexedData.discriminator = undefined;
IndexedData.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "IndexedDataTypeEnum",
        "format": ""
    },
    {
        "name": "fields",
        "baseName": "fields",
        "type": "{ [key: string]: IndexedField; }",
        "format": ""
    }
];
//# sourceMappingURL=IndexedData.js.map