import { Folder } from '../models/Folder';
import { Paging } from '../models/Paging';
export declare class CollectionResponseFolder {
    'results': Array<Folder>;
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
