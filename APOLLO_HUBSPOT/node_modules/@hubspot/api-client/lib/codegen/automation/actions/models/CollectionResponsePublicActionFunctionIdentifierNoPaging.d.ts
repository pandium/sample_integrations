import { PublicActionFunctionIdentifier } from '../models/PublicActionFunctionIdentifier';
export declare class CollectionResponsePublicActionFunctionIdentifierNoPaging {
    'results': Array<PublicActionFunctionIdentifier>;
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
