"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputPublicAssociationMultiArchive = void 0;
class BatchInputPublicAssociationMultiArchive {
    static getAttributeTypeMap() {
        return BatchInputPublicAssociationMultiArchive.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputPublicAssociationMultiArchive = BatchInputPublicAssociationMultiArchive;
BatchInputPublicAssociationMultiArchive.discriminator = undefined;
BatchInputPublicAssociationMultiArchive.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PublicAssociationMultiArchive>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputPublicAssociationMultiArchive.js.map