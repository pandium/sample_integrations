import { SubscriptionResponse } from '../models/SubscriptionResponse';
export declare class BatchResponseSubscriptionResponse {
    'status': BatchResponseSubscriptionResponseStatusEnum;
    'results': Array<SubscriptionResponse>;
    'requestedAt'?: Date;
    'startedAt': Date;
    'completedAt': Date;
    'links'?: {
        [key: string]: string;
    };
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
export type BatchResponseSubscriptionResponseStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
