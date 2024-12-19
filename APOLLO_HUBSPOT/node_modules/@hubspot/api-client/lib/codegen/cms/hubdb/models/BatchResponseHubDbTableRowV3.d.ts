import { HubDbTableRowV3 } from '../models/HubDbTableRowV3';
export declare class BatchResponseHubDbTableRowV3 {
    'status'?: BatchResponseHubDbTableRowV3StatusEnum;
    'results'?: Array<HubDbTableRowV3>;
    'requestedAt'?: Date;
    'startedAt'?: Date;
    'completedAt'?: Date;
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
export type BatchResponseHubDbTableRowV3StatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
