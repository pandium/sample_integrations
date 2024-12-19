import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponsePublicOwnerForwardPaging } from '../models/CollectionResponsePublicOwnerForwardPaging';
import { PublicOwner } from '../models/PublicOwner';
export declare class OwnersApiRequestFactory extends BaseAPIRequestFactory {
    getById(ownerId: number, idProperty?: 'id' | 'userId', archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getPage(email?: string, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class OwnersApiResponseProcessor {
    getById(response: ResponseContext): Promise<PublicOwner>;
    getPage(response: ResponseContext): Promise<CollectionResponsePublicOwnerForwardPaging>;
}
