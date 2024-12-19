"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchInputSimplePublicObjectId = void 0;
class BatchInputSimplePublicObjectId {
    static getAttributeTypeMap() {
        return BatchInputSimplePublicObjectId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchInputSimplePublicObjectId = BatchInputSimplePublicObjectId;
BatchInputSimplePublicObjectId.discriminator = undefined;
BatchInputSimplePublicObjectId.attributeTypeMap = [
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<SimplePublicObjectId>",
        "format": ""
    }
];
//# sourceMappingURL=BatchInputSimplePublicObjectId.js.map