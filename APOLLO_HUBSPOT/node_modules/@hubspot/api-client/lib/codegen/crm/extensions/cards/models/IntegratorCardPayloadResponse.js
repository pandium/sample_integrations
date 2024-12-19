"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegratorCardPayloadResponse = void 0;
class IntegratorCardPayloadResponse {
    static getAttributeTypeMap() {
        return IntegratorCardPayloadResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IntegratorCardPayloadResponse = IntegratorCardPayloadResponse;
IntegratorCardPayloadResponse.discriminator = undefined;
IntegratorCardPayloadResponse.attributeTypeMap = [
    {
        "name": "totalCount",
        "baseName": "totalCount",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "allItemsLinkUrl",
        "baseName": "allItemsLinkUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "cardLabel",
        "baseName": "cardLabel",
        "type": "string",
        "format": ""
    },
    {
        "name": "topLevelActions",
        "baseName": "topLevelActions",
        "type": "TopLevelActions",
        "format": ""
    },
    {
        "name": "sections",
        "baseName": "sections",
        "type": "Array<IntegratorObjectResult>",
        "format": ""
    },
    {
        "name": "responseVersion",
        "baseName": "responseVersion",
        "type": "IntegratorCardPayloadResponseResponseVersionEnum",
        "format": ""
    }
];
//# sourceMappingURL=IntegratorCardPayloadResponse.js.map