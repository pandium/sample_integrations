import { ActionRevision } from '../models/ActionRevision';
import { ForwardPaging } from '../models/ForwardPaging';
export declare class CollectionResponseActionRevisionForwardPaging {
    'results': Array<ActionRevision>;
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
