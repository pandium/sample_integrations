import { AssociationSpecWithLabel } from '../models/AssociationSpecWithLabel';
export declare class MultiAssociatedObjectWithLabel {
    'toObjectId': number;
    'associationTypes': Array<AssociationSpecWithLabel>;
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
