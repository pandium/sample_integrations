import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '../models/CollectionResponseWithTotalSimplePublicObjectForwardPaging';
import { PublicObjectSearchRequest } from '../models/PublicObjectSearchRequest';
export declare class SearchApiRequestFactory extends BaseAPIRequestFactory {
    doSearch(publicObjectSearchRequest: PublicObjectSearchRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class SearchApiResponseProcessor {
    doSearch(response: ResponseContext): Promise<CollectionResponseWithTotalSimplePublicObjectForwardPaging>;
}
