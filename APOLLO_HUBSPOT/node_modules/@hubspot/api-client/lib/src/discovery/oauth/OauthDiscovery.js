"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs = __importStar(require("querystring"));
const index_1 = require("../../../codegen/oauth/index");
const rxjsStub_1 = require("../../../codegen/oauth/rxjsStub");
const ApiClientConfigurator_1 = require("../../configuration/ApiClientConfigurator");
const ApiDecoratorService_1 = __importDefault(require("../../services/ApiDecoratorService"));
class OauthDiscovery {
    constructor(config = {}) {
        const configuration = (0, index_1.createConfiguration)(ApiClientConfigurator_1.ApiClientConfigurator.getParams(config, index_1.ServerConfiguration, rxjsStub_1.Observable, rxjsStub_1.Observable));
        this.accessTokensApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.AccessTokensApi(configuration));
        this.refreshTokensApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.RefreshTokensApi(configuration));
        this.tokensApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.TokensApi(configuration));
    }
    getAuthorizationUrl(clientId, redirectUri, scope, optionalScope, state) {
        const params = {
            client_id: clientId,
            redirect_uri: redirectUri,
            scope,
            optional_scope: optionalScope,
            state,
        };
        if (params.optional_scope === undefined) {
            delete params.optional_scope;
        }
        if (params.state === undefined) {
            delete params.state;
        }
        return `https://app.hubspot.com/oauth/authorize?${qs.stringify(params)}`;
    }
}
exports.default = OauthDiscovery;
//# sourceMappingURL=OauthDiscovery.js.map