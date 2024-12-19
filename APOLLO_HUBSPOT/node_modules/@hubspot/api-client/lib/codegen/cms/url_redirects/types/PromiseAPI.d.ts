import { Configuration } from '../configuration';
import { CollectionResponseWithTotalUrlMappingForwardPaging } from '../models/CollectionResponseWithTotalUrlMappingForwardPaging';
import { UrlMapping } from '../models/UrlMapping';
import { UrlMappingCreateRequestBody } from '../models/UrlMappingCreateRequestBody';
import { RedirectsApiRequestFactory, RedirectsApiResponseProcessor } from "../apis/RedirectsApi";
export declare class PromiseRedirectsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: RedirectsApiRequestFactory, responseProcessor?: RedirectsApiResponseProcessor);
    archive(urlRedirectId: string, _options?: Configuration): Promise<void>;
    create(urlMappingCreateRequestBody: UrlMappingCreateRequestBody, _options?: Configuration): Promise<UrlMapping>;
    getById(urlRedirectId: string, _options?: Configuration): Promise<UrlMapping>;
    getPage(createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, sort?: Array<string>, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Promise<CollectionResponseWithTotalUrlMappingForwardPaging>;
    update(urlRedirectId: string, urlMapping: UrlMapping, _options?: Configuration): Promise<UrlMapping>;
}
