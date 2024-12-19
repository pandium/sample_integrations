import { Configuration } from '../configuration';
import { CollectionResponsePublicPermissionSetNoPaging } from '../models/CollectionResponsePublicPermissionSetNoPaging';
import { CollectionResponsePublicTeamNoPaging } from '../models/CollectionResponsePublicTeamNoPaging';
import { CollectionResponsePublicUserForwardPaging } from '../models/CollectionResponsePublicUserForwardPaging';
import { PublicUser } from '../models/PublicUser';
import { PublicUserUpdate } from '../models/PublicUserUpdate';
import { UserProvisionRequest } from '../models/UserProvisionRequest';
import { RolesApiRequestFactory, RolesApiResponseProcessor } from "../apis/RolesApi";
export declare class PromiseRolesApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: RolesApiRequestFactory, responseProcessor?: RolesApiResponseProcessor);
    getAll(_options?: Configuration): Promise<CollectionResponsePublicPermissionSetNoPaging>;
}
import { TeamsApiRequestFactory, TeamsApiResponseProcessor } from "../apis/TeamsApi";
export declare class PromiseTeamsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: TeamsApiRequestFactory, responseProcessor?: TeamsApiResponseProcessor);
    getAll(_options?: Configuration): Promise<CollectionResponsePublicTeamNoPaging>;
}
import { UsersApiRequestFactory, UsersApiResponseProcessor } from "../apis/UsersApi";
export declare class PromiseUsersApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: UsersApiRequestFactory, responseProcessor?: UsersApiResponseProcessor);
    archive(userId: string, idProperty?: string, _options?: Configuration): Promise<void>;
    create(userProvisionRequest: UserProvisionRequest, _options?: Configuration): Promise<PublicUser>;
    getById(userId: string, idProperty?: string, _options?: Configuration): Promise<PublicUser>;
    getPage(limit?: number, after?: string, _options?: Configuration): Promise<CollectionResponsePublicUserForwardPaging>;
    replace(userId: string, publicUserUpdate: PublicUserUpdate, idProperty?: string, _options?: Configuration): Promise<PublicUser>;
}
