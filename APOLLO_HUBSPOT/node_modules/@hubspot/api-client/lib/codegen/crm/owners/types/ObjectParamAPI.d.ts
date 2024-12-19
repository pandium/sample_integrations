import { Configuration } from '../configuration';
import { CollectionResponsePublicOwnerForwardPaging } from '../models/CollectionResponsePublicOwnerForwardPaging';
import { PublicOwner } from '../models/PublicOwner';
import { OwnersApiRequestFactory, OwnersApiResponseProcessor } from "../apis/OwnersApi";
export interface OwnersApiGetByIdRequest {
    ownerId: number;
    idProperty?: 'id' | 'userId';
    archived?: boolean;
}
export interface OwnersApiGetPageRequest {
    email?: string;
    after?: string;
    limit?: number;
    archived?: boolean;
}
export declare class ObjectOwnersApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: OwnersApiRequestFactory, responseProcessor?: OwnersApiResponseProcessor);
    getById(param: OwnersApiGetByIdRequest, options?: Configuration): Promise<PublicOwner>;
    getPage(param?: OwnersApiGetPageRequest, options?: Configuration): Promise<CollectionResponsePublicOwnerForwardPaging>;
}
