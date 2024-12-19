import { SimplePublicObject } from '../models/SimplePublicObject';
import { StandardError } from '../models/StandardError';
export declare class BatchResponseSimplePublicObjectWithErrors {
    'status': BatchResponseSimplePublicObjectWithErrorsStatusEnum;
    'results': Array<SimplePublicObject>;
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
export type BatchResponseSimplePublicObjectWithErrorsStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
