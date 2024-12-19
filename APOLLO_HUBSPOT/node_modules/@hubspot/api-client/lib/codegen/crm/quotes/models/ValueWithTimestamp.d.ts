export declare class ValueWithTimestamp {
    'value': string;
    'timestamp': Date;
    'sourceType': string;
    'sourceId'?: string;
    'sourceLabel'?: string;
    'updatedByUserId'?: number;
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
