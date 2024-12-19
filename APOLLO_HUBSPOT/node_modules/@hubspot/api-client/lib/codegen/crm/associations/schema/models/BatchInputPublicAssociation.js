"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputPublicAssociation = void 0;
class BatchInputPublicAssociation {
    static getAttributeTypeMap() {
        return BatchInputPublicAssociation.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputPublicAssociation = BatchInputPublicAssociation;
BatchInputPublicAssociation.discriminator = undefined;
BatchInputPublicAssociation.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PublicAssociation>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputPublicAssociation.js.map