import { AccessTokensApi, RefreshTokensApi, TokensApi } from '../../../codegen/oauth/index';
import IConfiguration from '../../configuration/IConfiguration';
export default class OauthDiscovery {
    accessTokensApi: AccessTokensApi;
    refreshTokensApi: RefreshTokensApi;
    tokensApi: TokensApi;
    constructor(config?: IConfiguration);
    getAuthorizationUrl(clientId: string, redirectUri: string, scope: string, optionalScope?: string, state?: string): string;
}
