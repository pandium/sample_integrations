"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchReadInputSimplePublicObjectId = void 0;
class BatchReadInputSimplePublicObjectId {
    static getAttributeTypeMap() {
        return BatchReadInputSimplePublicObjectId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchReadInputSimplePublicObjectId = BatchReadInputSimplePublicObjectId;
BatchReadInputSimplePublicObjectId.discriminator = undefined;
BatchReadInputSimplePublicObjectId.attributeTypeMap = [
    {
        "name": "properties",
        "baseName": "properties",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "propertiesWithHistory",
        "baseName": "propertiesWithHistory",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "idProperty",
        "baseName": "idProperty",
        "type": "string",
        "format": ""
    },
    {
        "name": "inputs",
        "baseName": "inputs",
        "type": "Array<SimplePublicObjectId>",
        "format": ""
    }
];
//# sourceMappingURL=BatchReadInputSimplePublicObjectId.js.map