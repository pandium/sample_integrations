"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentificationTokenGenerationRequest = void 0;
class IdentificationTokenGenerationRequest {
    static getAttributeTypeMap() {
        return IdentificationTokenGenerationRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IdentificationTokenGenerationRequest = IdentificationTokenGenerationRequest;
IdentificationTokenGenerationRequest.discriminator = undefined;
IdentificationTokenGenerationRequest.attributeTypeMap = [
    {
        "name": "email",
        "baseName": "email",
        "type": "string",
        "format": ""
    },
    {
        "name": "firstName",
        "baseName": "firstName",
        "type": "string",
        "format": ""
    },
    {
        "name": "lastName",
        "baseName": "lastName",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=IdentificationTokenGenerationRequest.js.map