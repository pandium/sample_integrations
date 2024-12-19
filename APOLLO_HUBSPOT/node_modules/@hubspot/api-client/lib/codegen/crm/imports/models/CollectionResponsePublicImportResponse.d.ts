import { Paging } from '../models/Paging';
import { PublicImportResponse } from '../models/PublicImportResponse';
export declare class CollectionResponsePublicImportResponse {
    'results': Array<PublicImportResponse>;
    'paging'?: Paging;
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
