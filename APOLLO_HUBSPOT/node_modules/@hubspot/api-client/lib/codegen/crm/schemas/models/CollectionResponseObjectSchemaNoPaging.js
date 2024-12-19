"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseObjectSchemaNoPaging = void 0;
class CollectionResponseObjectSchemaNoPaging {
    static getAttributeTypeMap() {
        return CollectionResponseObjectSchemaNoPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseObjectSchemaNoPaging = CollectionResponseObjectSchemaNoPaging;
CollectionResponseObjectSchemaNoPaging.discriminator = undefined;
CollectionResponseObjectSchemaNoPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<ObjectSchema>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseObjectSchemaNoPaging.js.map