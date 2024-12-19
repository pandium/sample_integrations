import { ForwardPaging } from '../models/ForwardPaging';
import { MultiAssociatedObjectWithLabel } from '../models/MultiAssociatedObjectWithLabel';
export declare class CollectionResponseMultiAssociatedObjectWithLabelForwardPaging {
    'paging'?: ForwardPaging;
    'results': Array<MultiAssociatedObjectWithLabel>;
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
