import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { CollectionResponseSmtpApiTokenViewForwardPaging } from '../models/CollectionResponseSmtpApiTokenViewForwardPaging';
import { EmailSendStatusView } from '../models/EmailSendStatusView';
import { PublicSingleSendRequestEgg } from '../models/PublicSingleSendRequestEgg';
import { SmtpApiTokenRequestEgg } from '../models/SmtpApiTokenRequestEgg';
import { SmtpApiTokenView } from '../models/SmtpApiTokenView';
import { PublicSmtpTokensApiRequestFactory, PublicSmtpTokensApiResponseProcessor } from "../apis/PublicSmtpTokensApi";
export declare class ObservablePublicSmtpTokensApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PublicSmtpTokensApiRequestFactory, responseProcessor?: PublicSmtpTokensApiResponseProcessor);
    archiveToken(tokenId: string, _options?: Configuration): Observable<void>;
    createToken(smtpApiTokenRequestEgg: SmtpApiTokenRequestEgg, _options?: Configuration): Observable<SmtpApiTokenView>;
    getTokenById(tokenId: string, _options?: Configuration): Observable<SmtpApiTokenView>;
    getTokensPage(campaignName?: string, emailCampaignId?: string, after?: string, limit?: number, _options?: Configuration): Observable<CollectionResponseSmtpApiTokenViewForwardPaging>;
    resetPassword(tokenId: string, _options?: Configuration): Observable<SmtpApiTokenView>;
}
import { SingleSendApiRequestFactory, SingleSendApiResponseProcessor } from "../apis/SingleSendApi";
export declare class ObservableSingleSendApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SingleSendApiRequestFactory, responseProcessor?: SingleSendApiResponseProcessor);
    sendEmail(publicSingleSendRequestEgg: PublicSingleSendRequestEgg, _options?: Configuration): Observable<EmailSendStatusView>;
}
