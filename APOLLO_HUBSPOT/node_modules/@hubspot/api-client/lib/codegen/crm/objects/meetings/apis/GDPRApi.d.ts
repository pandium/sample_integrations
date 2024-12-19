import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { PublicGdprDeleteInput } from '../models/PublicGdprDeleteInput';
export declare class GDPRApiRequestFactory extends BaseAPIRequestFactory {
    purge(publicGdprDeleteInput: PublicGdprDeleteInput, _options?: Configuration): Promise<RequestContext>;
}
export declare class GDPRApiResponseProcessor {
    purgeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
