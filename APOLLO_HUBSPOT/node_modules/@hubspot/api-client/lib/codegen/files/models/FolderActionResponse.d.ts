import { Folder } from '../models/Folder';
import { StandardError } from '../models/StandardError';
export declare class FolderActionResponse {
    'status': FolderActionResponseStatusEnum;
    'result'?: Folder;
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
export type FolderActionResponseStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
