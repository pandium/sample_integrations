import { PublicImportMetadata } from '../models/PublicImportMetadata';
export declare class PublicImportResponse {
    'state': PublicImportResponseStateEnum;
    'importRequestJson'?: any;
    'createdAt': Date;
    'metadata': PublicImportMetadata;
    'importName'?: string;
    'updatedAt': Date;
    'optOutImport': boolean;
    'id': string;
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
export type PublicImportResponseStateEnum = "STARTED" | "PROCESSING" | "DONE" | "FAILED" | "CANCELED" | "DEFERRED" | "REVERTED";
