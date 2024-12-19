import { ForwardPaging } from '../models/ForwardPaging';
import { HubDbTableRowV3 } from '../models/HubDbTableRowV3';
export declare class CollectionResponseWithTotalHubDbTableRowV3ForwardPaging {
    'total': number;
    'results': Array<HubDbTableRowV3>;
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
