import { PublicAssociationMultiPost } from '../models/PublicAssociationMultiPost';
export declare class BatchInputPublicAssociationMultiPost {
    'inputs': Array<PublicAssociationMultiPost>;
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
