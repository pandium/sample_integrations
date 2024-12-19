import { Configuration } from '../configuration';
import { CollectionResponseWithTotalUrlMappingForwardPaging } from '../models/CollectionResponseWithTotalUrlMappingForwardPaging';
import { UrlMapping } from '../models/UrlMapping';
import { UrlMappingCreateRequestBody } from '../models/UrlMappingCreateRequestBody';
import { RedirectsApiRequestFactory, RedirectsApiResponseProcessor } from "../apis/RedirectsApi";
export interface RedirectsApiArchiveRequest {
    urlRedirectId: string;
}
export interface RedirectsApiCreateRequest {
    urlMappingCreateRequestBody: UrlMappingCreateRequestBody;
}
export interface RedirectsApiGetByIdRequest {
    urlRedirectId: string;
}
export interface RedirectsApiGetPageRequest {
    createdAt?: Date;
    createdAfter?: Date;
    createdBefore?: Date;
    updatedAt?: Date;
    updatedAfter?: Date;
    updatedBefore?: Date;
    sort?: Array<string>;
    after?: string;
    limit?: number;
    archived?: boolean;
}
export interface RedirectsApiUpdateRequest {
    urlRedirectId: string;
    urlMapping: UrlMapping;
}
export declare class ObjectRedirectsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: RedirectsApiRequestFactory, responseProcessor?: RedirectsApiResponseProcessor);
    archive(param: RedirectsApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: RedirectsApiCreateRequest, options?: Configuration): Promise<UrlMapping>;
    getById(param: RedirectsApiGetByIdRequest, options?: Configuration): Promise<UrlMapping>;
    getPage(param?: RedirectsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseWithTotalUrlMappingForwardPaging>;
    update(param: RedirectsApiUpdateRequest, options?: Configuration): Promise<UrlMapping>;
}
