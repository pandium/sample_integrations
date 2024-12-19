import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { EmailSendStatusView } from '../models/EmailSendStatusView';
import { PublicSingleSendRequestEgg } from '../models/PublicSingleSendRequestEgg';
export declare class SingleSendApiRequestFactory extends BaseAPIRequestFactory {
    sendEmail(publicSingleSendRequestEgg: PublicSingleSendRequestEgg, _options?: Configuration): Promise<RequestContext>;
}
export declare class SingleSendApiResponseProcessor {
    sendEmail(response: ResponseContext): Promise<EmailSendStatusView>;
}
