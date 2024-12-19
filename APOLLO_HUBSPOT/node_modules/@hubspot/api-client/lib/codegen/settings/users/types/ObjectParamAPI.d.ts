import { Configuration } from '../configuration';
import { CollectionResponsePublicPermissionSetNoPaging } from '../models/CollectionResponsePublicPermissionSetNoPaging';
import { CollectionResponsePublicTeamNoPaging } from '../models/CollectionResponsePublicTeamNoPaging';
import { CollectionResponsePublicUserForwardPaging } from '../models/CollectionResponsePublicUserForwardPaging';
import { PublicUser } from '../models/PublicUser';
import { PublicUserUpdate } from '../models/PublicUserUpdate';
import { UserProvisionRequest } from '../models/UserProvisionRequest';
import { RolesApiRequestFactory, RolesApiResponseProcessor } from "../apis/RolesApi";
export interface RolesApiGetAllRequest {
}
export declare class ObjectRolesApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: RolesApiRequestFactory, responseProcessor?: RolesApiResponseProcessor);
    getAll(param?: RolesApiGetAllRequest, options?: Configuration): Promise<CollectionResponsePublicPermissionSetNoPaging>;
}
import { TeamsApiRequestFactory, TeamsApiResponseProcessor } from "../apis/TeamsApi";
export interface TeamsApiGetAllRequest {
}
export declare class ObjectTeamsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: TeamsApiRequestFactory, responseProcessor?: TeamsApiResponseProcessor);
    getAll(param?: TeamsApiGetAllRequest, options?: Configuration): Promise<CollectionResponsePublicTeamNoPaging>;
}
import { UsersApiRequestFactory, UsersApiResponseProcessor } from "../apis/UsersApi";
export interface UsersApiArchiveRequest {
    userId: string;
    idProperty?: string;
}
export interface UsersApiCreateRequest {
    userProvisionRequest: UserProvisionRequest;
}
export interface UsersApiGetByIdRequest {
    userId: string;
    idProperty?: string;
}
export interface UsersApiGetPageRequest {
    limit?: number;
    after?: string;
}
export interface UsersApiReplaceRequest {
    userId: string;
    publicUserUpdate: PublicUserUpdate;
    idProperty?: string;
}
export declare class ObjectUsersApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: UsersApiRequestFactory, responseProcessor?: UsersApiResponseProcessor);
    archive(param: UsersApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: UsersApiCreateRequest, options?: Configuration): Promise<PublicUser>;
    getById(param: UsersApiGetByIdRequest, options?: Configuration): Promise<PublicUser>;
    getPage(param?: UsersApiGetPageRequest, options?: Configuration): Promise<CollectionResponsePublicUserForwardPaging>;
    replace(param: UsersApiReplaceRequest, options?: Configuration): Promise<PublicUser>;
}
