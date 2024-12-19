"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseProperty = void 0;
class CollectionResponseProperty {
    static getAttributeTypeMap() {
        return CollectionResponseProperty.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseProperty = CollectionResponseProperty;
CollectionResponseProperty.discriminator = undefined;
CollectionResponseProperty.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Property>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseProperty.js.map