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
export interface PipelineAuditsApiGetAuditRequest {
    objectType: string;
    pipelineId: string;
}
export declare class ObjectPipelineAuditsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelineAuditsApiRequestFactory, responseProcessor?: PipelineAuditsApiResponseProcessor);
    getAudit(param: PipelineAuditsApiGetAuditRequest, options?: Configuration): Promise<CollectionResponsePublicAuditInfoNoPaging>;
}
import { PipelineStageAuditsApiRequestFactory, PipelineStageAuditsApiResponseProcessor } from "../apis/PipelineStageAuditsApi";
export interface PipelineStageAuditsApiGetAuditRequest {
    objectType: string;
    stageId: string;
}
export declare class ObjectPipelineStageAuditsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelineStageAuditsApiRequestFactory, responseProcessor?: PipelineStageAuditsApiResponseProcessor);
    getAudit(param: PipelineStageAuditsApiGetAuditRequest, options?: Configuration): Promise<CollectionResponsePublicAuditInfoNoPaging>;
}
import { PipelineStagesApiRequestFactory, PipelineStagesApiResponseProcessor } from "../apis/PipelineStagesApi";
export interface PipelineStagesApiArchiveRequest {
    objectType: string;
    pipelineId: string;
    stageId: string;
}
export interface PipelineStagesApiCreateRequest {
    objectType: string;
    pipelineId: string;
    pipelineStageInput: PipelineStageInput;
}
export interface PipelineStagesApiGetAllRequest {
    objectType: string;
    pipelineId: string;
}
export interface PipelineStagesApiGetByIdRequest {
    objectType: string;
    pipelineId: string;
    stageId: string;
}
export interface PipelineStagesApiReplaceRequest {
    objectType: string;
    pipelineId: string;
    stageId: string;
    pipelineStageInput: PipelineStageInput;
}
export interface PipelineStagesApiUpdateRequest {
    objectType: string;
    pipelineId: string;
    stageId: string;
    pipelineStagePatchInput: PipelineStagePatchInput;
}
export declare class ObjectPipelineStagesApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelineStagesApiRequestFactory, responseProcessor?: PipelineStagesApiResponseProcessor);
    archive(param: PipelineStagesApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: PipelineStagesApiCreateRequest, options?: Configuration): Promise<PipelineStage>;
    getAll(param: PipelineStagesApiGetAllRequest, options?: Configuration): Promise<CollectionResponsePipelineStageNoPaging>;
    getById(param: PipelineStagesApiGetByIdRequest, options?: Configuration): Promise<PipelineStage>;
    replace(param: PipelineStagesApiReplaceRequest, options?: Configuration): Promise<PipelineStage>;
    update(param: PipelineStagesApiUpdateRequest, options?: Configuration): Promise<PipelineStage>;
}
import { PipelinesApiRequestFactory, PipelinesApiResponseProcessor } from "../apis/PipelinesApi";
export interface PipelinesApiArchiveRequest {
    objectType: string;
    pipelineId: string;
    validateReferencesBeforeDelete?: boolean;
}
export interface PipelinesApiCreateRequest {
    objectType: string;
    pipelineInput: PipelineInput;
}
export interface PipelinesApiGetAllRequest {
    objectType: string;
}
export interface PipelinesApiGetByIdRequest {
    objectType: string;
    pipelineId: string;
}
export interface PipelinesApiReplaceRequest {
    objectType: string;
    pipelineId: string;
    pipelineInput: PipelineInput;
    validateReferencesBeforeDelete?: boolean;
}
export interface PipelinesApiUpdateRequest {
    objectType: string;
    pipelineId: string;
    pipelinePatchInput: PipelinePatchInput;
    validateReferencesBeforeDelete?: boolean;
}
export declare class ObjectPipelinesApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PipelinesApiRequestFactory, responseProcessor?: PipelinesApiResponseProcessor);
    archive(param: PipelinesApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: PipelinesApiCreateRequest, options?: Configuration): Promise<Pipeline>;
    getAll(param: PipelinesApiGetAllRequest, options?: Configuration): Promise<CollectionResponsePipelineNoPaging>;
    getById(param: PipelinesApiGetByIdRequest, options?: Configuration): Promise<Pipeline>;
    replace(param: PipelinesApiReplaceRequest, options?: Configuration): Promise<Pipeline>;
    update(param: PipelinesApiUpdateRequest, options?: Configuration): Promise<Pipeline>;
}
