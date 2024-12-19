import { ForwardPaging } from '../models/ForwardPaging';
import { SimplePublicObject } from '../models/SimplePublicObject';
export declare class CollectionResponseWithTotalSimplePublicObjectForwardPaging {
    'total': number;
    'results': Array<SimplePublicObject>;
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
