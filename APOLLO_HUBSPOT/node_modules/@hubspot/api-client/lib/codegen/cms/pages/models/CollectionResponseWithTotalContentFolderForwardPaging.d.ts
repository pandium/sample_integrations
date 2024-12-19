import { ContentFolder } from '../models/ContentFolder';
import { ForwardPaging } from '../models/ForwardPaging';
export declare class CollectionResponseWithTotalContentFolderForwardPaging {
    'total': number;
    'paging'?: ForwardPaging;
    'results': Array<ContentFolder>;
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
