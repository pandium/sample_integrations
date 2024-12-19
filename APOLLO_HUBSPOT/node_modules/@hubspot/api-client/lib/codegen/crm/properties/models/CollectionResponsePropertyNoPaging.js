"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePropertyNoPaging = void 0;
class CollectionResponsePropertyNoPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePropertyNoPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePropertyNoPaging = CollectionResponsePropertyNoPaging;
CollectionResponsePropertyNoPaging.discriminator = undefined;
CollectionResponsePropertyNoPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Property>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePropertyNoPaging.js.map