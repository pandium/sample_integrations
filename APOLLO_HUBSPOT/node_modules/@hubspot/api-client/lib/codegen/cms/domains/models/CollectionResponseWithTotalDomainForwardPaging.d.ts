import { Domain } from '../models/Domain';
import { ForwardPaging } from '../models/ForwardPaging';
export declare class CollectionResponseWithTotalDomainForwardPaging {
    'total': number;
    'results': Array<Domain>;
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
