import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
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
export declare class ObservablePipelineAuditsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PipelineAuditsApiRequestFactory, responseProcessor?: PipelineAuditsApiResponseProcessor);
    getAudit(objectType: string, pipelineId: string, _options?: Configuration): Observable<CollectionResponsePublicAuditInfoNoPaging>;
}
import { PipelineStageAuditsApiRequestFactory, PipelineStageAuditsApiResponseProcessor } from "../apis/PipelineStageAuditsApi";
export declare class ObservablePipelineStageAuditsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PipelineStageAuditsApiRequestFactory, responseProcessor?: PipelineStageAuditsApiResponseProcessor);
    getAudit(objectType: string, stageId: string, _options?: Configuration): Observable<CollectionResponsePublicAuditInfoNoPaging>;
}
import { PipelineStagesApiRequestFactory, PipelineStagesApiResponseProcessor } from "../apis/PipelineStagesApi";
export declare class ObservablePipelineStagesApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PipelineStagesApiRequestFactory, responseProcessor?: PipelineStagesApiResponseProcessor);
    archive(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Observable<void>;
    create(objectType: string, pipelineId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Observable<PipelineStage>;
    getAll(objectType: string, pipelineId: string, _options?: Configuration): Observable<CollectionResponsePipelineStageNoPaging>;
    getById(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Observable<PipelineStage>;
    replace(objectType: string, pipelineId: string, stageId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Observable<PipelineStage>;
    update(objectType: string, pipelineId: string, stageId: string, pipelineStagePatchInput: PipelineStagePatchInput, _options?: Configuration): Observable<PipelineStage>;
}
import { PipelinesApiRequestFactory, PipelinesApiResponseProcessor } from "../apis/PipelinesApi";
export declare class ObservablePipelinesApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PipelinesApiRequestFactory, responseProcessor?: PipelinesApiResponseProcessor);
    archive(objectType: string, pipelineId: string, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Observable<void>;
    create(objectType: string, pipelineInput: PipelineInput, _options?: Configuration): Observable<Pipeline>;
    getAll(objectType: string, _options?: Configuration): Observable<CollectionResponsePipelineNoPaging>;
    getById(objectType: string, pipelineId: string, _options?: Configuration): Observable<Pipeline>;
    replace(objectType: string, pipelineId: string, pipelineInput: PipelineInput, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Observable<Pipeline>;
    update(objectType: string, pipelineId: string, pipelinePatchInput: PipelinePatchInput, validateReferencesBeforeDelete?: boolean, _options?: Configuration): Observable<Pipeline>;
}
