import { PublicAssociation } from '../models/PublicAssociation';
export declare class BatchInputPublicAssociation {
    'inputs': Array<PublicAssociation>;
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
