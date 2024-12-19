"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseWithTotalVersionPage = void 0;
class CollectionResponseWithTotalVersionPage {
    static getAttributeTypeMap() {
        return CollectionResponseWithTotalVersionPage.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseWithTotalVersionPage = CollectionResponseWithTotalVersionPage;
CollectionResponseWithTotalVersionPage.discriminator = undefined;
CollectionResponseWithTotalVersionPage.attributeTypeMap = [
    {
        "name": "total",
        "baseName": "total",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "Paging",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<VersionPage>",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseWithTotalVersionPage.js.map