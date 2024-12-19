import { Configuration } from '../configuration';
import { CollectionResponseWithTotalDomainForwardPaging } from '../models/CollectionResponseWithTotalDomainForwardPaging';
import { Domain } from '../models/Domain';
import { DomainsApiRequestFactory, DomainsApiResponseProcessor } from "../apis/DomainsApi";
export interface DomainsApiGetByIdRequest {
    domainId: string;
}
export interface DomainsApiGetPageRequest {
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
export declare class ObjectDomainsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: DomainsApiRequestFactory, responseProcessor?: DomainsApiResponseProcessor);
    getById(param: DomainsApiGetByIdRequest, options?: Configuration): Promise<Domain>;
    getPage(param?: DomainsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseWithTotalDomainForwardPaging>;
}
