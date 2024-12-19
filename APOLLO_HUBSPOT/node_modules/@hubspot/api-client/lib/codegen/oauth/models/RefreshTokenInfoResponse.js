"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenInfoResponse = void 0;
class RefreshTokenInfoResponse {
    static getAttributeTypeMap() {
        return RefreshTokenInfoResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.RefreshTokenInfoResponse = RefreshTokenInfoResponse;
RefreshTokenInfoResponse.discriminator = undefined;
RefreshTokenInfoResponse.attributeTypeMap = [
    {
        "name": "token",
        "baseName": "token",
        "type": "string",
        "format": ""
    },
    {
        "name": "user",
        "baseName": "user",
        "type": "string",
        "format": ""
    },
    {
        "name": "hubDomain",
        "baseName": "hub_domain",
        "type": "string",
        "format": ""
    },
    {
        "name": "scopes",
        "baseName": "scopes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "hubId",
        "baseName": "hub_id",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "clientId",
        "baseName": "client_id",
        "type": "string",
        "format": ""
    },
    {
        "name": "userId",
        "baseName": "user_id",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "tokenType",
        "baseName": "token_type",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=RefreshTokenInfoResponse.js.map