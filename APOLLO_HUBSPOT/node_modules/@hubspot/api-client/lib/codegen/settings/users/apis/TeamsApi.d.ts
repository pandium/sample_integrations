import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponsePublicTeamNoPaging } from '../models/CollectionResponsePublicTeamNoPaging';
export declare class TeamsApiRequestFactory extends BaseAPIRequestFactory {
    getAll(_options?: Configuration): Promise<RequestContext>;
}
export declare class TeamsApiResponseProcessor {
    getAll(response: ResponseContext): Promise<CollectionResponsePublicTeamNoPaging>;
}
