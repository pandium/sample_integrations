import { SimplePublicObjectBatchInput } from '../models/SimplePublicObjectBatchInput';
export declare class BatchInputSimplePublicObjectBatchInput {
    'inputs': Array<SimplePublicObjectBatchInput>;
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
