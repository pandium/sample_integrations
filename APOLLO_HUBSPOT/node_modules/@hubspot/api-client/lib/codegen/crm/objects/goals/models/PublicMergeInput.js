"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicMergeInput = void 0;
class PublicMergeInput {
    static getAttributeTypeMap() {
        return PublicMergeInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicMergeInput = PublicMergeInput;
PublicMergeInput.discriminator = undefined;
PublicMergeInput.attributeTypeMap = [
    {
        "name": "objectIdToMerge",
        "baseName": "objectIdToMerge",
        "type": "string",
        "format": ""
    },
    {
        "name": "primaryObjectId",
        "baseName": "primaryObjectId",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicMergeInput.js.map