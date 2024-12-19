"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportFromUrlTaskLocator = void 0;
class ImportFromUrlTaskLocator {
    static getAttributeTypeMap() {
        return ImportFromUrlTaskLocator.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ImportFromUrlTaskLocator = ImportFromUrlTaskLocator;
ImportFromUrlTaskLocator.discriminator = undefined;
ImportFromUrlTaskLocator.attributeTypeMap = [
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
//# sourceMappingURL=ImportFromUrlTaskLocator.js.map