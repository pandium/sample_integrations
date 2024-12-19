import { StandardError } from '../models/StandardError';
import { SubscriptionResponse } from '../models/SubscriptionResponse';
export declare class BatchResponseSubscriptionResponseWithErrors {
    'status': BatchResponseSubscriptionResponseWithErrorsStatusEnum;
    'results': Array<SubscriptionResponse>;
    'numErrors'?: number;
    'errors'?: Array<StandardError>;
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
export type BatchResponseSubscriptionResponseWithErrorsStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
