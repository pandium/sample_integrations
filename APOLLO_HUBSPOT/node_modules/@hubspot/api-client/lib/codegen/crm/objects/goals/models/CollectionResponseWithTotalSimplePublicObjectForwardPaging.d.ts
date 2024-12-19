import { ForwardPaging } from '../models/ForwardPaging';
import { SimplePublicObject } from '../models/SimplePublicObject';
export declare class CollectionResponseWithTotalSimplePublicObjectForwardPaging {
    'total': number;
    'paging'?: ForwardPaging;
    'results': Array<SimplePublicObject>;
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
