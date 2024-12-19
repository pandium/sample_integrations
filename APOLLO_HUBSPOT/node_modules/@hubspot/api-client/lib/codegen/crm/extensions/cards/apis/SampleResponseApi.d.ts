import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { IntegratorCardPayloadResponse } from '../models/IntegratorCardPayloadResponse';
export declare class SampleResponseApiRequestFactory extends BaseAPIRequestFactory {
    getCardsSampleResponse(_options?: Configuration): Promise<RequestContext>;
}
export declare class SampleResponseApiResponseProcessor {
    getCardsSampleResponse(response: ResponseContext): Promise<IntegratorCardPayloadResponse>;
}
