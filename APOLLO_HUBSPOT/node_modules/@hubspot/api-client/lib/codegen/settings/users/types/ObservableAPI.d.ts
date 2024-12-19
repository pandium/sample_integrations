import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { CollectionResponsePublicPermissionSetNoPaging } from '../models/CollectionResponsePublicPermissionSetNoPaging';
import { CollectionResponsePublicTeamNoPaging } from '../models/CollectionResponsePublicTeamNoPaging';
import { CollectionResponsePublicUserForwardPaging } from '../models/CollectionResponsePublicUserForwardPaging';
import { PublicUser } from '../models/PublicUser';
import { PublicUserUpdate } from '../models/PublicUserUpdate';
import { UserProvisionRequest } from '../models/UserProvisionRequest';
import { RolesApiRequestFactory, RolesApiResponseProcessor } from "../apis/RolesApi";
export declare class ObservableRolesApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: RolesApiRequestFactory, responseProcessor?: RolesApiResponseProcessor);
    getAll(_options?: Configuration): Observable<CollectionResponsePublicPermissionSetNoPaging>;
}
import { TeamsApiRequestFactory, TeamsApiResponseProcessor } from "../apis/TeamsApi";
export declare class ObservableTeamsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: TeamsApiRequestFactory, responseProcessor?: TeamsApiResponseProcessor);
    getAll(_options?: Configuration): Observable<CollectionResponsePublicTeamNoPaging>;
}
import { UsersApiRequestFactory, UsersApiResponseProcessor } from "../apis/UsersApi";
export declare class ObservableUsersApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: UsersApiRequestFactory, responseProcessor?: UsersApiResponseProcessor);
    archive(userId: string, idProperty?: string, _options?: Configuration): Observable<void>;
    create(userProvisionRequest: UserProvisionRequest, _options?: Configuration): Observable<PublicUser>;
    getById(userId: string, idProperty?: string, _options?: Configuration): Observable<PublicUser>;
    getPage(limit?: number, after?: string, _options?: Configuration): Observable<CollectionResponsePublicUserForwardPaging>;
    replace(userId: string, publicUserUpdate: PublicUserUpdate, idProperty?: string, _options?: Configuration): Observable<PublicUser>;
}
