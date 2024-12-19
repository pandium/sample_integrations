import { SubscriptionBatchUpdateRequest } from '../models/SubscriptionBatchUpdateRequest';
export declare class BatchInputSubscriptionBatchUpdateRequest {
    'inputs': Array<SubscriptionBatchUpdateRequest>;
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
