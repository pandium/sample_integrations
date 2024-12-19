import { PipelineStageInput } from '../models/PipelineStageInput';
export declare class PipelineInput {
    'label': string;
    'displayOrder': number;
    'stages': Array<PipelineStageInput>;
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
