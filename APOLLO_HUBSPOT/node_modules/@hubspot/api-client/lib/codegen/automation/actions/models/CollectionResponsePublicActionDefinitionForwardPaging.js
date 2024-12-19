"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponsePublicActionDefinitionForwardPaging = void 0;
class CollectionResponsePublicActionDefinitionForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponsePublicActionDefinitionForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponsePublicActionDefinitionForwardPaging = CollectionResponsePublicActionDefinitionForwardPaging;
CollectionResponsePublicActionDefinitionForwardPaging.discriminator = undefined;
CollectionResponsePublicActionDefinitionForwardPaging.attributeTypeMap = [
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicActionDefinition>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponsePublicActionDefinitionForwardPaging.js.map