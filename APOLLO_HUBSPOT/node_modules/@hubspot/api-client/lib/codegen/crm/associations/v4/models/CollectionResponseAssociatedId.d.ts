import { AssociatedId } from '../models/AssociatedId';
import { Paging } from '../models/Paging';
export declare class CollectionResponseAssociatedId {
    'paging'?: Paging;
    'results': Array<AssociatedId>;
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
