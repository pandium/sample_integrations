import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponseWithTotalUrlMappingForwardPaging } from '../models/CollectionResponseWithTotalUrlMappingForwardPaging';
import { UrlMapping } from '../models/UrlMapping';
import { UrlMappingCreateRequestBody } from '../models/UrlMappingCreateRequestBody';
export declare class RedirectsApiRequestFactory extends BaseAPIRequestFactory {
    archive(urlRedirectId: string, _options?: Configuration): Promise<RequestContext>;
    create(urlMappingCreateRequestBody: UrlMappingCreateRequestBody, _options?: Configuration): Promise<RequestContext>;
    getById(urlRedirectId: string, _options?: Configuration): Promise<RequestContext>;
    getPage(createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, sort?: Array<string>, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    update(urlRedirectId: string, urlMapping: UrlMapping, _options?: Configuration): Promise<RequestContext>;
}
export declare class RedirectsApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<UrlMapping>;
    getById(response: ResponseContext): Promise<UrlMapping>;
    getPage(response: ResponseContext): Promise<CollectionResponseWithTotalUrlMappingForwardPaging>;
    update(response: ResponseContext): Promise<UrlMapping>;
}
