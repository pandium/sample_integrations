"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicPermissionSet = void 0;
class PublicPermissionSet {
    static getAttributeTypeMap() {
        return PublicPermissionSet.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicPermissionSet = PublicPermissionSet;
PublicPermissionSet.discriminator = undefined;
PublicPermissionSet.attributeTypeMap = [
    {
        "name": "requiresBillingWrite",
        "baseName": "requiresBillingWrite",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicPermissionSet.js.map