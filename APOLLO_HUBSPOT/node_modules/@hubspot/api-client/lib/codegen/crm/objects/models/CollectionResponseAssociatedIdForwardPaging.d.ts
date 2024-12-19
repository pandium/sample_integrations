import { AssociatedId } from '../models/AssociatedId';
import { ForwardPaging } from '../models/ForwardPaging';
export declare class CollectionResponseAssociatedIdForwardPaging {
    'results': Array<AssociatedId>;
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
