import { HubDbTableRowV3 } from '../models/HubDbTableRowV3';
import { StandardError } from '../models/StandardError';
export declare class BatchResponseHubDbTableRowV3WithErrors {
    'status': BatchResponseHubDbTableRowV3WithErrorsStatusEnum;
    'results': Array<HubDbTableRowV3>;
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
export type BatchResponseHubDbTableRowV3WithErrorsStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
