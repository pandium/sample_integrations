import { Paging } from '../models/Paging';
import { VersionContentFolder } from '../models/VersionContentFolder';
export declare class CollectionResponseWithTotalVersionContentFolder {
    'total': number;
    'paging'?: Paging;
    'results': Array<VersionContentFolder>;
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
