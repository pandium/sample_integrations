import { PublicAssociation } from '../models/PublicAssociation';
export declare class BatchResponsePublicAssociation {
    'status': BatchResponsePublicAssociationStatusEnum;
    'results': Array<PublicAssociation>;
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
export type BatchResponsePublicAssociationStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
