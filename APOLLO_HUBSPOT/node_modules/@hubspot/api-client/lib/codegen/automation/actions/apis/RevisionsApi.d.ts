import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { ActionRevision } from '../models/ActionRevision';
import { CollectionResponseActionRevisionForwardPaging } from '../models/CollectionResponseActionRevisionForwardPaging';
export declare class RevisionsApiRequestFactory extends BaseAPIRequestFactory {
    getById(definitionId: string, revisionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    getPage(definitionId: string, appId: number, limit?: number, after?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class RevisionsApiResponseProcessor {
    getById(response: ResponseContext): Promise<ActionRevision>;
    getPage(response: ResponseContext): Promise<CollectionResponseActionRevisionForwardPaging>;
}
