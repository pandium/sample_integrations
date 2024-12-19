"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociatedId = void 0;
class AssociatedId {
    static getAttributeTypeMap() {
        return AssociatedId.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AssociatedId = AssociatedId;
AssociatedId.discriminator = undefined;
AssociatedId.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=AssociatedId.js.map