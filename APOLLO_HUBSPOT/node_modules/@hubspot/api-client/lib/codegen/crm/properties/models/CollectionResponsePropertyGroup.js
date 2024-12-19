"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePropertyGroup = void 0;
class CollectionResponsePropertyGroup {
    static getAttributeTypeMap() {
        return CollectionResponsePropertyGroup.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePropertyGroup = CollectionResponsePropertyGroup;
CollectionResponsePropertyGroup.discriminator = undefined;
CollectionResponsePropertyGroup.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PropertyGroup>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePropertyGroup.js.map