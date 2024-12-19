import { PipelineStage } from '../models/PipelineStage';
export declare class CollectionResponsePipelineStageNoPaging {
    'results': Array<PipelineStage>;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
        format: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
        format: string;
    }[];
    constructor();
}
