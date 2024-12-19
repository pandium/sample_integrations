import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponsePublicAuditInfoNoPaging } from '../models/CollectionResponsePublicAuditInfoNoPaging';
export declare class PipelineStageAuditsApiRequestFactory extends BaseAPIRequestFactory {
    getAudit(objectType: string, stageId: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class PipelineStageAuditsApiResponseProcessor {
    getAudit(response: ResponseContext): Promise<CollectionResponsePublicAuditInfoNoPaging>;
}
