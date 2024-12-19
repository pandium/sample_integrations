import { PublicActionDefinition } from '../models/PublicActionDefinition';
export declare class PublicActionRevision {
    'revisionId': string;
    'createdAt': Date;
    'definition': PublicActionDefinition;
    'id': string;
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
