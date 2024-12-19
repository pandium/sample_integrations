export declare class LabelsBetweenObjectPair {
    'fromObjectTypeId': string;
    'fromObjectId': number;
    'toObjectTypeId': string;
    'toObjectId': number;
    'labels': Array<string>;
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
