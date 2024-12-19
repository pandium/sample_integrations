import { ForwardPaging } from '../models/ForwardPaging';
import { Page } from '../models/Page';
export declare class CollectionResponseWithTotalPageForwardPaging {
    'total': number;
    'paging'?: ForwardPaging;
    'results': Array<Page>;
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
