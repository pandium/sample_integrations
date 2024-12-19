import { ForwardPaging } from '../models/ForwardPaging';
import { SimplePublicObjectWithAssociations } from '../models/SimplePublicObjectWithAssociations';
export declare class CollectionResponseSimplePublicObjectWithAssociationsForwardPaging {
    'results': Array<SimplePublicObjectWithAssociations>;
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
