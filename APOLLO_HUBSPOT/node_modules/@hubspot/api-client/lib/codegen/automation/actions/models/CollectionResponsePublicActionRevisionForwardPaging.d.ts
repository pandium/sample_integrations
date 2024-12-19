import { ForwardPaging } from '../models/ForwardPaging';
import { PublicActionRevision } from '../models/PublicActionRevision';
export declare class CollectionResponsePublicActionRevisionForwardPaging {
    'paging'?: ForwardPaging;
    'results': Array<PublicActionRevision>;
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
