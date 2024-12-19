import { PublicAssociationMultiArchive } from '../models/PublicAssociationMultiArchive';
export declare class BatchInputPublicAssociationMultiArchive {
    'inputs': Array<PublicAssociationMultiArchive>;
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
