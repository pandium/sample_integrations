import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponsePipelineStageNoPaging } from '../models/CollectionResponsePipelineStageNoPaging';
import { PipelineStage } from '../models/PipelineStage';
import { PipelineStageInput } from '../models/PipelineStageInput';
import { PipelineStagePatchInput } from '../models/PipelineStagePatchInput';
export declare class PipelineStagesApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, pipelineId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Promise<RequestContext>;
    getAll(objectType: string, pipelineId: string, _options?: Configuration): Promise<RequestContext>;
    getById(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Promise<RequestContext>;
    replace(objectType: string, pipelineId: string, stageId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, pipelineId: string, stageId: string, pipelineStagePatchInput: PipelineStagePatchInput, _options?: Configuration): Promise<RequestContext>;
}
export declare class PipelineStagesApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<PipelineStage>;
    getAll(response: ResponseContext): Promise<CollectionResponsePipelineStageNoPaging>;
    getById(response: ResponseContext): Promise<PipelineStage>;
    replace(response: ResponseContext): Promise<PipelineStage>;
    update(response: ResponseContext): Promise<PipelineStage>;
}
