import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponseSmtpApiTokenViewForwardPaging } from '../models/CollectionResponseSmtpApiTokenViewForwardPaging';
import { SmtpApiTokenRequestEgg } from '../models/SmtpApiTokenRequestEgg';
import { SmtpApiTokenView } from '../models/SmtpApiTokenView';
export declare class PublicSmtpTokensApiRequestFactory extends BaseAPIRequestFactory {
    archiveToken(tokenId: string, _options?: Configuration): Promise<RequestContext>;
    createToken(smtpApiTokenRequestEgg: SmtpApiTokenRequestEgg, _options?: Configuration): Promise<RequestContext>;
    getTokenById(tokenId: string, _options?: Configuration): Promise<RequestContext>;
    getTokensPage(campaignName?: string, emailCampaignId?: string, after?: string, limit?: number, _options?: Configuration): Promise<RequestContext>;
    resetPassword(tokenId: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class PublicSmtpTokensApiResponseProcessor {
    archiveToken(response: ResponseContext): Promise<void>;
    createToken(response: ResponseContext): Promise<SmtpApiTokenView>;
    getTokenById(response: ResponseContext): Promise<SmtpApiTokenView>;
    getTokensPage(response: ResponseContext): Promise<CollectionResponseSmtpApiTokenViewForwardPaging>;
    resetPassword(response: ResponseContext): Promise<SmtpApiTokenView>;
}
