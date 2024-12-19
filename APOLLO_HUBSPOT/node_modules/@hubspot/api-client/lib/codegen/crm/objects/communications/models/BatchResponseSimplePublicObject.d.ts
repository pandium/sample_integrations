import { SimplePublicObject } from '../models/SimplePublicObject';
export declare class BatchResponseSimplePublicObject {
    'status': BatchResponseSimplePublicObjectStatusEnum;
    'results': Array<SimplePublicObject>;
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
export type BatchResponseSimplePublicObjectStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
