import { CallbackCompletionBatchRequest } from '../models/CallbackCompletionBatchRequest';
export declare class BatchInputCallbackCompletionBatchRequest {
    'inputs': Array<CallbackCompletionBatchRequest>;
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
