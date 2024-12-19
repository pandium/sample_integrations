import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { CollectionResponseWithTotalUrlMappingForwardPaging } from '../models/CollectionResponseWithTotalUrlMappingForwardPaging';
import { UrlMapping } from '../models/UrlMapping';
import { UrlMappingCreateRequestBody } from '../models/UrlMappingCreateRequestBody';
import { RedirectsApiRequestFactory, RedirectsApiResponseProcessor } from "../apis/RedirectsApi";
export declare class ObservableRedirectsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: RedirectsApiRequestFactory, responseProcessor?: RedirectsApiResponseProcessor);
    archive(urlRedirectId: string, _options?: Configuration): Observable<void>;
    create(urlMappingCreateRequestBody: UrlMappingCreateRequestBody, _options?: Configuration): Observable<UrlMapping>;
    getById(urlRedirectId: string, _options?: Configuration): Observable<UrlMapping>;
    getPage(createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, sort?: Array<string>, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Observable<CollectionResponseWithTotalUrlMappingForwardPaging>;
    update(urlRedirectId: string, urlMapping: UrlMapping, _options?: Configuration): Observable<UrlMapping>;
}
