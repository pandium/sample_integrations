import { ForwardPaging } from '../models/ForwardPaging';
import { Tag } from '../models/Tag';
export declare class CollectionResponseWithTotalTagForwardPaging {
    'total': number;
    'results': Array<Tag>;
    'paging'?: ForwardPaging;
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
