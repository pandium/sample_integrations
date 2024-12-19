import { StandardError } from '../models/StandardError';
export declare class FileActionResponse {
    'status': FileActionResponseStatusEnum;
    'result'?: any;
    'numErrors'?: number;
    'errors'?: Array<StandardError>;
    'requestedAt'?: Date;
    'startedAt': Date;
    'completedAt': Date;
    'links'?: {
        [key: string]: string;
    };
    'taskId': string;
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
export type FileActionResponseStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
