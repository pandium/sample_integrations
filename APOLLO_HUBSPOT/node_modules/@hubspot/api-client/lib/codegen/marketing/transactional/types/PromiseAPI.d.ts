import { Configuration } from '../configuration';
import { CollectionResponseSmtpApiTokenViewForwardPaging } from '../models/CollectionResponseSmtpApiTokenViewForwardPaging';
import { EmailSendStatusView } from '../models/EmailSendStatusView';
import { PublicSingleSendRequestEgg } from '../models/PublicSingleSendRequestEgg';
import { SmtpApiTokenRequestEgg } from '../models/SmtpApiTokenRequestEgg';
import { SmtpApiTokenView } from '../models/SmtpApiTokenView';
import { PublicSmtpTokensApiRequestFactory, PublicSmtpTokensApiResponseProcessor } from "../apis/PublicSmtpTokensApi";
export declare class PromisePublicSmtpTokensApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicSmtpTokensApiRequestFactory, responseProcessor?: PublicSmtpTokensApiResponseProcessor);
    archiveToken(tokenId: string, _options?: Configuration): Promise<void>;
    createToken(smtpApiTokenRequestEgg: SmtpApiTokenRequestEgg, _options?: Configuration): Promise<SmtpApiTokenView>;
    getTokenById(tokenId: string, _options?: Configuration): Promise<SmtpApiTokenView>;
    getTokensPage(campaignName?: string, emailCampaignId?: string, after?: string, limit?: number, _options?: Configuration): Promise<CollectionResponseSmtpApiTokenViewForwardPaging>;
    resetPassword(tokenId: string, _options?: Configuration): Promise<SmtpApiTokenView>;
}
import { SingleSendApiRequestFactory, SingleSendApiResponseProcessor } from "../apis/SingleSendApi";
export declare class PromiseSingleSendApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SingleSendApiRequestFactory, responseProcessor?: SingleSendApiResponseProcessor);
    sendEmail(publicSingleSendRequestEgg: PublicSingleSendRequestEgg, _options?: Configuration): Promise<EmailSendStatusView>;
}
