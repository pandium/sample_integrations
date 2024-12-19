"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseExtensionActionDefinitionForwardPaging = void 0;
class CollectionResponseExtensionActionDefinitionForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseExtensionActionDefinitionForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseExtensionActionDefinitionForwardPaging = CollectionResponseExtensionActionDefinitionForwardPaging;
CollectionResponseExtensionActionDefinitionForwardPaging.discriminator = undefined;
CollectionResponseExtensionActionDefinitionForwardPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<ExtensionActionDefinition>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseExtensionActionDefinitionForwardPaging.js.map