import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { PublicGdprDeleteInput } from '../models/PublicGdprDeleteInput';
export declare class GDPRApiRequestFactory extends BaseAPIRequestFactory {
    purge(publicGdprDeleteInput: PublicGdprDeleteInput, _options?: Configuration): Promise<RequestContext>;
}
export declare class GDPRApiResponseProcessor {
    purge(response: ResponseContext): Promise<void>;
}
