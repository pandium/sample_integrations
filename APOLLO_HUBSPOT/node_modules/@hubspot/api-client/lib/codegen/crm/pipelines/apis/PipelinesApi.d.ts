import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponsePipelineNoPaging } from '../models/CollectionResponsePipelineNoPaging';
import { Pipeline } from '../models/Pipeline';
import { PipelineInput } from '../models/PipelineInput';
import { PipelinePatchInput } from '../models/PipelinePatchInput';
export declare class PipelinesApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, pipelineId: string, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, pipelineInput: PipelineInput, _options?: Configuration): Promise<RequestContext>;
    getAll(objectType: string, _options?: Configuration): Promise<RequestContext>;
    getById(objectType: string, pipelineId: string, _options?: Configuration): Promise<RequestContext>;
    replace(objectType: string, pipelineId: string, pipelineInput: PipelineInput, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, pipelineId: string, pipelinePatchInput: PipelinePatchInput, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class PipelinesApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<Pipeline>;
    getAll(response: ResponseContext): Promise<CollectionResponsePipelineNoPaging>;
    getById(response: ResponseContext): Promise<Pipeline>;
    replace(response: ResponseContext): Promise<Pipeline>;
    update(response: ResponseContext): Promise<Pipeline>;
}
