import { ForwardPaging } from '../models/ForwardPaging';
import { UrlMapping } from '../models/UrlMapping';
export declare class CollectionResponseWithTotalUrlMappingForwardPaging {
    'total': number;
    'results': Array<UrlMapping>;
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
