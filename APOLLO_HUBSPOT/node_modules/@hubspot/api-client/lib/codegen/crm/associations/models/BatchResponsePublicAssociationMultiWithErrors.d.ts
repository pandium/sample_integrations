import { PublicAssociationMulti } from '../models/PublicAssociationMulti';
import { StandardError } from '../models/StandardError';
export declare class BatchResponsePublicAssociationMultiWithErrors {
    'status': BatchResponsePublicAssociationMultiWithErrorsStatusEnum;
    'results': Array<PublicAssociationMulti>;
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
export type BatchResponsePublicAssociationMultiWithErrorsStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
