import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { SubscriptionDefinitionsResponse } from '../models/SubscriptionDefinitionsResponse';
export declare class DefinitionApiRequestFactory extends BaseAPIRequestFactory {
    getPage(_options?: Configuration): Promise<RequestContext>;
}
export declare class DefinitionApiResponseProcessor {
    getPage(response: ResponseContext): Promise<SubscriptionDefinitionsResponse>;
}
