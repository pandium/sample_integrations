import { CollectionResponseFormDefinitionBaseForwardPagingResultsInner } from '../models/CollectionResponseFormDefinitionBaseForwardPagingResultsInner';
import { ForwardPaging } from '../models/ForwardPaging';
export declare class CollectionResponseFormDefinitionBaseForwardPaging {
    'paging'?: ForwardPaging;
    'results': Array<CollectionResponseFormDefinitionBaseForwardPagingResultsInner>;
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
