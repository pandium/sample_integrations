export declare class ValueWithTimestamp {
    'sourceId'?: string;
    'sourceType': string;
    'sourceLabel'?: string;
    'updatedByUserId'?: number;
    'value': string;
    'timestamp': Date;
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
