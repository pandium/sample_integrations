import { PublicFetchAssociationsBatchRequest } from '../models/PublicFetchAssociationsBatchRequest';
export declare class BatchInputPublicFetchAssociationsBatchRequest {
    'inputs': Array<PublicFetchAssociationsBatchRequest>;
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
