import { Configuration } from '../configuration';
import { CollectionResponseSmtpApiTokenViewForwardPaging } from '../models/CollectionResponseSmtpApiTokenViewForwardPaging';
import { EmailSendStatusView } from '../models/EmailSendStatusView';
import { PublicSingleSendRequestEgg } from '../models/PublicSingleSendRequestEgg';
import { SmtpApiTokenRequestEgg } from '../models/SmtpApiTokenRequestEgg';
import { SmtpApiTokenView } from '../models/SmtpApiTokenView';
import { PublicSmtpTokensApiRequestFactory, PublicSmtpTokensApiResponseProcessor } from "../apis/PublicSmtpTokensApi";
export interface PublicSmtpTokensApiArchiveTokenRequest {
    tokenId: string;
}
export interface PublicSmtpTokensApiCreateTokenRequest {
    smtpApiTokenRequestEgg: SmtpApiTokenRequestEgg;
}
export interface PublicSmtpTokensApiGetTokenByIdRequest {
    tokenId: string;
}
export interface PublicSmtpTokensApiGetTokensPageRequest {
    campaignName?: string;
    emailCampaignId?: string;
    after?: string;
    limit?: number;
}
export interface PublicSmtpTokensApiResetPasswordRequest {
    tokenId: string;
}
export declare class ObjectPublicSmtpTokensApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicSmtpTokensApiRequestFactory, responseProcessor?: PublicSmtpTokensApiResponseProcessor);
    archiveToken(param: PublicSmtpTokensApiArchiveTokenRequest, options?: Configuration): Promise<void>;
    createToken(param: PublicSmtpTokensApiCreateTokenRequest, options?: Configuration): Promise<SmtpApiTokenView>;
    getTokenById(param: PublicSmtpTokensApiGetTokenByIdRequest, options?: Configuration): Promise<SmtpApiTokenView>;
    getTokensPage(param?: PublicSmtpTokensApiGetTokensPageRequest, options?: Configuration): Promise<CollectionResponseSmtpApiTokenViewForwardPaging>;
    resetPassword(param: PublicSmtpTokensApiResetPasswordRequest, options?: Configuration): Promise<SmtpApiTokenView>;
}
import { SingleSendApiRequestFactory, SingleSendApiResponseProcessor } from "../apis/SingleSendApi";
export interface SingleSendApiSendEmailRequest {
    publicSingleSendRequestEgg: PublicSingleSendRequestEgg;
}
export declare class ObjectSingleSendApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SingleSendApiRequestFactory, responseProcessor?: SingleSendApiResponseProcessor);
    sendEmail(param: SingleSendApiSendEmailRequest, options?: Configuration): Promise<EmailSendStatusView>;
}
