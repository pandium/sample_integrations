"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputPublicObjectId = void 0;
class BatchInputPublicObjectId {
    static getAttributeTypeMap() {
        return BatchInputPublicObjectId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputPublicObjectId = BatchInputPublicObjectId;
BatchInputPublicObjectId.discriminator = undefined;
BatchInputPublicObjectId.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<PublicObjectId>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputPublicObjectId.js.map