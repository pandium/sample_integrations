import { PublicDefaultAssociationMultiPost } from '../models/PublicDefaultAssociationMultiPost';
export declare class BatchInputPublicDefaultAssociationMultiPost {
    'inputs': Array<PublicDefaultAssociationMultiPost>;
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
