import { PublicObjectListRecord } from '../models/PublicObjectListRecord';
export declare class PublicImportMetadata {
    'objectLists': Array<PublicObjectListRecord>;
    'counters': {
        [key: string]: number;
    };
    'fileIds': Array<string>;
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
