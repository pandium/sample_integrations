import { Configuration } from '../configuration';
import { CollectionResponsePipelineNoPaging } from '../models/CollectionResponsePipelineNoPaging';
import { CollectionResponsePipelineStageNoPaging } from '../models/CollectionResponsePipelineStageNoPaging';
import { CollectionResponsePublicAuditInfoNoPaging } from '../models/CollectionResponsePublicAuditInfoNoPaging';
import { Pipeline } from '../models/Pipeline';
import { PipelineInput } from '../models/PipelineInput';
import { PipelinePatchInput } from '../models/PipelinePatchInput';
import { PipelineStage } from '../models/PipelineStage';
import { PipelineStageInput } from '../models/PipelineStageInput';
import { PipelineStagePatchInput } from '../models/PipelineStagePatchInput';
import { PipelineAuditsApiRequestFactory, PipelineAuditsApiResponseProcessor } from "../apis/PipelineAuditsApi";
export declare class PromisePipelineAuditsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelineAuditsApiRequestFactory, responseProcessor?: PipelineAuditsApiResponseProcessor);
    getAudit(objectType: string, pipelineId: string, _options?: Configuration): Promise<CollectionResponsePublicAuditInfoNoPaging>;
}
import { PipelineStageAuditsApiRequestFactory, PipelineStageAuditsApiResponseProcessor } from "../apis/PipelineStageAuditsApi";
export declare class PromisePipelineStageAuditsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelineStageAuditsApiRequestFactory, responseProcessor?: PipelineStageAuditsApiResponseProcessor);
    getAudit(objectType: string, stageId: string, _options?: Configuration): Promise<CollectionResponsePublicAuditInfoNoPaging>;
}
import { PipelineStagesApiRequestFactory, PipelineStagesApiResponseProcessor } from "../apis/PipelineStagesApi";
export declare class PromisePipelineStagesApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelineStagesApiRequestFactory, responseProcessor?: PipelineStagesApiResponseProcessor);
    archive(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Promise<void>;
    create(objectType: string, pipelineId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Promise<PipelineStage>;
    getAll(objectType: string, pipelineId: string, _options?: Configuration): Promise<CollectionResponsePipelineStageNoPaging>;
    getById(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Promise<PipelineStage>;
    replace(objectType: string, pipelineId: string, stageId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Promise<PipelineStage>;
    update(objectType: string, pipelineId: string, stageId: string, pipelineStagePatchInput: PipelineStagePatchInput, _options?: Configuration): Promise<PipelineStage>;
}
import { PipelinesApiRequestFactory, PipelinesApiResponseProcessor } from "../apis/PipelinesApi";
export declare class PromisePipelinesApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelinesApiRequestFactory, responseProcessor?: PipelinesApiResponseProcessor);
    archive(objectType: string, pipelineId: string, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Promise<void>;
    create(objectType: string, pipelineInput: PipelineInput, _options?: Configuration): Promise<Pipeline>;
    getAll(objectType: string, _options?: Configuration): Promise<CollectionResponsePipelineNoPaging>;
    getById(objectType: string, pipelineId: string, _options?: Configuration): Promise<Pipeline>;
    replace(objectType: string, pipelineId: string, pipelineInput: PipelineInput, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Promise<Pipeline>;
    update(objectType: string, pipelineId: string, pipelinePatchInput: PipelinePatchInput, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Promise<Pipeline>;
}
