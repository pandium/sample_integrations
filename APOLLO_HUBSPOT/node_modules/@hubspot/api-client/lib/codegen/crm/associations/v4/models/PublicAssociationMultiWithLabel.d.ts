import { MultiAssociatedObjectWithLabel } from '../models/MultiAssociatedObjectWithLabel';
import { Paging } from '../models/Paging';
import { PublicObjectId } from '../models/PublicObjectId';
export declare class PublicAssociationMultiWithLabel {
    '_from': PublicObjectId;
    'paging'?: Paging;
    'to': Array<MultiAssociatedObjectWithLabel>;
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
