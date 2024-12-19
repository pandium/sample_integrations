import { PublicAssociationDefinition } from '../models/PublicAssociationDefinition';
export declare class CollectionResponsePublicAssociationDefinitionNoPaging {
    'results': Array<PublicAssociationDefinition>;
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
