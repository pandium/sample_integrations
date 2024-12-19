import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { PublicMergeInput } from '../models/PublicMergeInput';
import { SimplePublicObject } from '../models/SimplePublicObject';
export declare class PublicObjectApiRequestFactory extends BaseAPIRequestFactory {
    merge(objectType: string, publicMergeInput: PublicMergeInput, _options?: Configuration): Promise<RequestContext>;
}
export declare class PublicObjectApiResponseProcessor {
    merge(response: ResponseContext): Promise<SimplePublicObject>;
}
