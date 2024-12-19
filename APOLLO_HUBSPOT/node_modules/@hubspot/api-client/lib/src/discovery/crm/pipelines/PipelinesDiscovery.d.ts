import { PipelineAuditsApi, PipelinesApi, PipelineStageAuditsApi, PipelineStagesApi } from '../../../../codegen/crm/pipelines/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class PipelinesDiscovery {
    pipelineAuditsApi: PipelineAuditsApi;
    pipelineStageAuditsApi: PipelineStageAuditsApi;
    pipelineStagesApi: PipelineStagesApi;
    pipelinesApi: PipelinesApi;
    constructor(config: IConfiguration);
}
