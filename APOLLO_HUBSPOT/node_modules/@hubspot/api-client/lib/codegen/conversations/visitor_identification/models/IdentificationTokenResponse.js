"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentificationTokenResponse = void 0;
class IdentificationTokenResponse {
    static getAttributeTypeMap() {
        return IdentificationTokenResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IdentificationTokenResponse = IdentificationTokenResponse;
IdentificationTokenResponse.discriminator = undefined;
IdentificationTokenResponse.attributeTypeMap = [
    {
        "name": "token",
        "baseName": "token",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=IdentificationTokenResponse.js.map