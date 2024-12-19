import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
export declare class PublicObjectSchemasApiRequestFactory extends BaseAPIRequestFactory {
    purge(objectType: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class PublicObjectSchemasApiResponseProcessor {
    purge(response: ResponseContext): Promise<void>;
}
