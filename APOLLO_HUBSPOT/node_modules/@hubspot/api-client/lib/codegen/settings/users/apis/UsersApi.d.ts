import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponsePublicUserForwardPaging } from '../models/CollectionResponsePublicUserForwardPaging';
import { PublicUser } from '../models/PublicUser';
import { PublicUserUpdate } from '../models/PublicUserUpdate';
import { UserProvisionRequest } from '../models/UserProvisionRequest';
export declare class UsersApiRequestFactory extends BaseAPIRequestFactory {
    archive(userId: string, idProperty?: string, _options?: Configuration): Promise<RequestContext>;
    create(userProvisionRequest: UserProvisionRequest, _options?: Configuration): Promise<RequestContext>;
    getById(userId: string, idProperty?: string, _options?: Configuration): Promise<RequestContext>;
    getPage(limit?: number, after?: string, _options?: Configuration): Promise<RequestContext>;
    replace(userId: string, publicUserUpdate: PublicUserUpdate, idProperty?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class UsersApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<PublicUser>;
    getById(response: ResponseContext): Promise<PublicUser>;
    getPage(response: ResponseContext): Promise<CollectionResponsePublicUserForwardPaging>;
    replace(response: ResponseContext): Promise<PublicUser>;
}
