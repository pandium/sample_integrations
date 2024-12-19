import { PipelineStage } from '../models/PipelineStage';
export declare class Pipeline {
    'label': string;
    'displayOrder': number;
    'id': string;
    'stages': Array<PipelineStage>;
    'createdAt': Date;
    'archivedAt'?: Date;
    'updatedAt': Date;
    'archived': boolean;
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
