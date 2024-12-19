import { Configuration } from '../configuration';
import { CollectionResponsePublicOwnerForwardPaging } from '../models/CollectionResponsePublicOwnerForwardPaging';
import { PublicOwner } from '../models/PublicOwner';
import { OwnersApiRequestFactory, OwnersApiResponseProcessor } from "../apis/OwnersApi";
export declare class PromiseOwnersApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: OwnersApiRequestFactory, responseProcessor?: OwnersApiResponseProcessor);
    getById(ownerId: number, idProperty?: 'id' | 'userId', archived?: boolean, _options?: Configuration): Promise<PublicOwner>;
    getPage(email?: string, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Promise<CollectionResponsePublicOwnerForwardPaging>;
}
