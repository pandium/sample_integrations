"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedField = void 0;
class IndexedField {
    static getAttributeTypeMap() {
        return IndexedField.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IndexedField = IndexedField;
IndexedField.discriminator = undefined;
IndexedField.attributeTypeMap = [
    {
        "name": "values",
        "baseName": "values",
        "type": "Array<any>",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "value",
        "baseName": "value",
        "type": "any",
        "format": ""
    },
    {
        "name": "metadataField",
        "baseName": "metadataField",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=IndexedField.js.map