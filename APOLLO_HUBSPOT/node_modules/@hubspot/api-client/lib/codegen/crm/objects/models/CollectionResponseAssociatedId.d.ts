import { AssociatedId } from '../models/AssociatedId';
import { Paging } from '../models/Paging';
export declare class CollectionResponseAssociatedId {
    'results': Array<AssociatedId>;
    'paging'?: Paging;
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
