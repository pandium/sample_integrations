import { AssociatedId } from '../models/AssociatedId';
import { Paging } from '../models/Paging';
import { PublicObjectId } from '../models/PublicObjectId';
export declare class PublicAssociationMulti {
    '_from': PublicObjectId;
    'to': Array<AssociatedId>;
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
