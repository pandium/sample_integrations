export declare class PipelineStage {
    'label': string;
    'displayOrder': number;
    'metadata': {
        [key: string]: string;
    };
    'id': string;
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
