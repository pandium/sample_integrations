"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseExternalUnifiedEvent = void 0;
class CollectionResponseExternalUnifiedEvent {
    static getAttributeTypeMap() {
        return CollectionResponseExternalUnifiedEvent.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseExternalUnifiedEvent = CollectionResponseExternalUnifiedEvent;
CollectionResponseExternalUnifiedEvent.discriminator = undefined;
CollectionResponseExternalUnifiedEvent.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<ExternalUnifiedEvent>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseExternalUnifiedEvent.js.map