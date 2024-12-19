"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenInfoResponse = void 0;
class AccessTokenInfoResponse {
    static getAttributeTypeMap() {
        return AccessTokenInfoResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AccessTokenInfoResponse = AccessTokenInfoResponse;
AccessTokenInfoResponse.discriminator = undefined;
AccessTokenInfoResponse.attributeTypeMap = [
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
        "name": "scopeToScopeGroupPks",
        "baseName": "scope_to_scope_group_pks",
        "type": "Array<number>",
        "format": "int32"
    },
    {
        "name": "trialScopes",
        "baseName": "trial_scopes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "trialScopeToScopeGroupPks",
        "baseName": "trial_scope_to_scope_group_pks",
        "type": "Array<number>",
        "format": "int32"
    },
    {
        "name": "hubId",
        "baseName": "hub_id",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "appId",
        "baseName": "app_id",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "expiresIn",
        "baseName": "expires_in",
        "type": "number",
        "format": "int32"
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
//# sourceMappingURL=AccessTokenInfoResponse.js.map