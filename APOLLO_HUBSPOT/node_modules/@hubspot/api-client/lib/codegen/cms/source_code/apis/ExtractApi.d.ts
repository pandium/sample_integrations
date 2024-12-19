import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
export declare class ExtractApiRequestFactory extends BaseAPIRequestFactory {
    extractByPath(path: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class ExtractApiResponseProcessor {
    extractByPath(response: ResponseContext): Promise<void>;
}
