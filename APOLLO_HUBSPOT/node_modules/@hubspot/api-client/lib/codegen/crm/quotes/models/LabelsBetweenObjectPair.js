"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelsBetweenObjectPair = void 0;
class LabelsBetweenObjectPair {
    static getAttributeTypeMap() {
        return LabelsBetweenObjectPair.attributeTypeMap;
    }
    constructor() {
    }
}
exports.LabelsBetweenObjectPair = LabelsBetweenObjectPair;
LabelsBetweenObjectPair.discriminator = undefined;
LabelsBetweenObjectPair.attributeTypeMap = [
    {
        "name": "fromObjectTypeId",
        "baseName": "fromObjectTypeId",
        "type": "string",
        "format": ""
    },
    {
        "name": "fromObjectId",
        "baseName": "fromObjectId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "toObjectTypeId",
        "baseName": "toObjectTypeId",
        "type": "string",
        "format": ""
    },
    {
        "name": "toObjectId",
        "baseName": "toObjectId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "labels",
        "baseName": "labels",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=LabelsBetweenObjectPair.js.map