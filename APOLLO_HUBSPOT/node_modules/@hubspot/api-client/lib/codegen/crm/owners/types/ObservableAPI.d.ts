import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { CollectionResponsePublicOwnerForwardPaging } from '../models/CollectionResponsePublicOwnerForwardPaging';
import { PublicOwner } from '../models/PublicOwner';
import { OwnersApiRequestFactory, OwnersApiResponseProcessor } from "../apis/OwnersApi";
export declare class ObservableOwnersApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: OwnersApiRequestFactory, responseProcessor?: OwnersApiResponseProcessor);
    getById(ownerId: number, idProperty?: 'id' | 'userId', archived?: boolean, _options?: Configuration): Observable<PublicOwner>;
    getPage(email?: string, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Observable<CollectionResponsePublicOwnerForwardPaging>;
}
