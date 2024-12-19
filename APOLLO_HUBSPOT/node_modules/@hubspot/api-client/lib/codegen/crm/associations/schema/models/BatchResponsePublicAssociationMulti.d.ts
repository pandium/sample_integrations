import { PublicAssociationMulti } from '../models/PublicAssociationMulti';
export declare class BatchResponsePublicAssociationMulti {
    'status': BatchResponsePublicAssociationMultiStatusEnum;
    'results': Array<PublicAssociationMulti>;
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
export type BatchResponsePublicAssociationMultiStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
